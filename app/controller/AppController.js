Ext.define('Isidamaps.controller.AppController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.AppController',
    urlGeodata: null,
    urlWebSocket: null,
    stationArray: [],
    callId: null,
    brigadeId: null,
    urlOpenStreetServerTiles: null,
    urlOpenStreetServerRoute: null,
    brigadeStatusesMap: (function () {
        const map = Ext.create('Ext.util.HashMap');
        map.add('FREE', 'Свободна');
        map.add('ON_EVENT', 'Дежурство на мероприятии');
        map.add('WITHOUT_SHIFT', 'Вне графика');
        map.add('CRASH_CAR', 'Ремонт');
        map.add('PASSED_BRIGADE', 'Принял вызов');
        map.add('AT_CALL', 'На вызове');
        map.add('RELAXON', 'Обед');
        map.add('GO_HOSPITAL', 'Транспортировка в стационар');
        map.add('HIJACKING', 'Нападение на бригаду');
        return map;
    })(),

    init: function () {
        const me = this,
            settingsStore = me.getStore('Isidamaps.store.SettingsStore');
        settingsStore.load({
            callback: function (records) {
                const settings = records[0];
                me.urlGeodata = settings.get('urlGeodata');
                me.urlWebSocket = settings.get('urlWebSocket');
            }
        });
    },

    connectWebSocked: function (service) {
        const me = this,
            socket = new SockJS(me.urlWebSocket + '/geo');
        me.stompClient = Stomp.over(socket);
        me.stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                me.stompClient.subscribe('/geo-queue/geodata-updates', function (msg) {
                    service === 'monitoring' ? me.loadSocketData(JSON.parse(msg.body)) : me.loadSocketDataForMonitoringBrigade(JSON.parse(msg.body));

                });
            }.bind(me),
            function (e) {
                console.error(e, "Reconnecting WS");
                Ext.defer(me.connect, 2500, me);
            }.bind(me)
        );
    },

    loadSocketDataForMonitoringBrigade: function (message) {
        const me = this;
        message.deviceId = '' + message.deviceId;
        if (message.objectType === 'BRIGADE' && me.brigadeId === message.deviceId) {
            let storeBrigades = me.getStore('Isidamaps.store.BrigadeFromWebSockedStore');
            storeBrigades.add(message);
        }

        if (message.objectType === 'CALL' && me.callId === message.deviceId) {
            let storeCalls = me.getStore('Isidamaps.store.CallFromWebSockedStore');
            storeCalls.add(message);
        }
    },

    loadSocketData: function (message) {
        const me = this;
        message.station = '' + message.station;
        if (!Ext.Array.contains(me.stationArray, message.station)) {
            return;
        }
        const store = me.getStore(message.objectType === 'BRIGADE' ? 'Isidamaps.store.BrigadeFromWebSockedStore' : 'Isidamaps.store.CallFromWebSockedStore');
        store.add(message);
    },

    getStoreMarkerInfo: function (object) {
        const me = this,
            urlInfoMarker = me.urlGeodata + '/info';
        const store = me.getStore(object.customOptions.objectType === 'BRIGADE' ? 'Isidamaps.store.BrigadeInfoStore' : 'Isidamaps.store.CallInfoStore');
        store.getProxy().setUrl(urlInfoMarker);
        return store;
    },

    readStation: function (station) {
        const me = this,
            brigadeStore = me.getStore('Isidamaps.store.BrigadesFirstLoadStore'),
            callStore = me.getStore('Isidamaps.store.CallsFirstLoadStore');
        station.forEach(function (st) {
            if (Ext.String.trim(st) !== '20') {
                me.stationArray.push(Ext.String.trim(st));
            }
        });
        const paramsBrigades = {
            stations: me.stationArray,
            statuses: ['CRASH_CAR', 'RELAXON', 'HIJACKING', 'ON_EVENT', 'GO_HOSPITAL', 'AT_CALL', 'PASSED_BRIGADE', 'FREE']
        };
        const paramsCalls = {
            stations: me.stationArray,
            statuses: ['NEW', 'ASSIGNED']
        };
        brigadeStore.load({
            url: Ext.String.format(me.urlGeodata + '/data'),
            params: paramsBrigades,
        });
        callStore.load({
            url: Ext.String.format(me.urlGeodata + '/call'),
            params: paramsCalls,
        });
        me.connectWebSocked('monitoring');
    },
    readMarkers: function (call, brigades) {
        const me = this,
            brigadeStore = me.getStore('Isidamaps.store.BrigadesFirstLoadStore'),
            callStore = me.getStore('Isidamaps.store.CallsFirstLoadStore');
        me.callId = call;
        me.brigadeId = brigades[0];
        const params = {
            callcardid: me.callId,
            brigades: me.brigadeId
        };
        Ext.Ajax.request({
            url: me.urlGeodata + '/brigade?',
            params: params,
            method: 'GET',

            success: function (response, opts) {
                let obj = Ext.decode(response.responseText);
                callStore.add(obj.call);
                brigadeStore.add(obj.brigades);
            },

            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
        me.connectWebSocked();
    },

    readMarkersForCallHistory: function (call) {
        const me = this,
            callStore = me.getStore('Isidamaps.store.CallsFirstLoadStore'),
            brigadeStore = me.getStore('Isidamaps.store.BrigadesFirstLoadStore'),
            routeHistoryStore = me.getStore('Isidamaps.store.RouteHistoryStore'),
            factRouteHistoryStore = me.getStore('Isidamaps.store.FactRouteHistoryStore'),
            params = {
                callcardid: call
            };

        Ext.Ajax.request({
            url: me.urlGeodata + '/route?',
            params: params,
            method: 'GET',

            success: function (response, opts) {
                let obj = Ext.decode(response.responseText);
                callStore.add(obj.call);
                routeHistoryStore.add(obj.brigadeRoute);
            },

            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
        Ext.Ajax.request({
            url: me.urlGeodata + '/route/fact?',
            params: params,
            method: 'GET',

            success: function (response, opts) {
                let obj = Ext.decode(response.responseText);
                brigadeStore.add([obj.endPoint, obj.startPoint]);
                factRouteHistoryStore.add(obj.points);
                callStore.add(obj.call);
            },

            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });

    },

    readMarkersBrigadeForAssign: function (call, brigades) {
        const me = this,
            callStore = me.getStore('Isidamaps.store.CallsFirstLoadStore'),
            brigadeStore = me.getStore('Isidamaps.store.BrigadesFirstLoadStore'),

            params = {
                callcardid: call,
                brigades: brigades
            };

        Ext.Ajax.request({
            url: me.urlGeodata + '/brigade?',
            params: params,
            method: 'GET',

            success: function (response, opts) {
                let obj = Ext.decode(response.responseText);
                callStore.add(obj.call);
                brigadeStore.add(obj.brigades);
            },

            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },

    windowClose: function () {
        window.close();
    }
});