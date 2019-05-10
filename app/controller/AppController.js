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
    brigadeStatuses: [
        {eng: 'FREE', rus: 'Свободна'},
        {eng: 'ON_EVENT', rus: 'black_widow'},
        {eng: 'WITHOUT_SHIFT', rus: 'Вне графика'},
        {eng: 'CRASH_CAR', rus: 'Ремонт'},
        {eng: 'PASSED_BRIGADE', rus: 'Принял вызов'},
        {eng: 'AT_CALL', rus: 'На вызове'},
        {eng: 'RELAXON', rus: 'Обед'},
        {eng: 'GO_HOSPITAL', rus: 'Транспортировка в стационар'},
        {eng: 'HIJACKING', rus: 'Нападение на бригаду'},
    ],

    getBrigadeStatuses: function (eng) {
        const args = this.brigadeStatuses.find(status => status.eng === eng);
        return args ? args.rus : 'Неизвестно';
    },

    initial: function (getGeoInform) {
        const settingsStore = this.getStore('Isidamaps.store.SettingsStore');
        settingsStore.load({
            callback: (records) => {
                const settings = records[0];
                this.urlGeodata = settings.get('urlGeodata');
                this.urlWebSocket = settings.get('urlWebSocket');
                getGeoInform();
            }
        });
    },

    connectWebSocked: function (service) {
        const socket = new SockJS(`${this.urlWebSocket}/geo`),
            reconn = () => {
                Ext.log({indent: 1, level: 'error'}, "Reconnecting WS");
                Ext.defer(this.connectWebSocked, 2500, this);
            },
            conn = (frame) => {
                Ext.log({indent: 1, level: 'info'}, `Connected: ${frame}`);
                this.stompClient.subscribe('/geo-queue/geodata-updates', (msg) => {
                    service === 'monitoring' ? this.loadSocketData(JSON.parse(msg.body)) : this.loadSocketDataForMonitoringBrigade(JSON.parse(msg.body));

                });
            };
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, conn, reconn);
    },

    loadSocketDataForMonitoringBrigade: function (message) {
        const {deviceId, objectType} = message;
        if (objectType === 'BRIGADE' && this.brigadeId === '' + deviceId) {
            let storeBrigades = this.getStore('Isidamaps.store.BrigadeFromWebSockedStore');
            storeBrigades.add(message);
        }

        if (objectType === 'CALL' && this.callId === '' + deviceId) {
            let storeCalls = this.getStore('Isidamaps.store.CallFromWebSockedStore');
            storeCalls.add(message);
        }
    },

    loadSocketData: function (message) {
        const {station, objectType} = message;
        if (!Ext.Array.contains(this.stationArray, '' + station)) {
            return;
        }
        const store = this.getStore(objectType === 'BRIGADE' ? 'Isidamaps.store.BrigadeFromWebSockedStore' : 'Isidamaps.store.CallFromWebSockedStore');
        store.add(message);
    },

    getStoreMarkerInfo: function (object) {
        const urlInfoMarker = `${this.urlGeodata}/info`,
            store = this.getStore(object.customOptions.objectType === 'BRIGADE' ? 'Isidamaps.store.BrigadeInfoStore' : 'Isidamaps.store.CallInfoStore');
        store.getProxy().setUrl(urlInfoMarker);
        return store;
    },

    readStation: function (station) {
        const brigadeStore = this.getStore('Isidamaps.store.BrigadesFirstLoadStore'),
            paramsBrigades = {
                stations: this.stationArray,
                statuses: ['CRASH_CAR', 'RELAXON', 'HIJACKING', 'ON_EVENT', 'GO_HOSPITAL', 'AT_CALL', 'PASSED_BRIGADE', 'FREE']
            },
            paramsCalls = {
                stations: this.stationArray,
                statuses: ['NEW', 'ASSIGNED']
            },
            callStore = this.getStore('Isidamaps.store.CallsFirstLoadStore');
        Ext.log({outdent: 1}, `Подстанции ${station}`);
        station.forEach((st) => {
            if (Ext.String.trim(st) !== '20') {
                this.stationArray.push(Ext.String.trim(st));
            }
        });
        brigadeStore.load({
            url: Ext.String.format(`${this.urlGeodata}/data`),
            params: paramsBrigades,
            callback: (records, operation, success) => {
                if (success) {
                    Ext.log({outdent: 1}, `Бригад из geoService ${records.length}`);
                    return
                }
                Ext.log({outdent: 1, level: 'error'}, 'Ошибка загрузки данных из geoService');
            }
        });
        callStore.load({
            url: Ext.String.format(`${this.urlGeodata}/call`),
            params: paramsCalls,
            callback: (records, operation, success) => {
                if (success) {
                    Ext.log({outdent: 1}, `Вызовов из geoService ${records.length}`);
                    return
                }
                Ext.log({outdent: 1, level: 'error'}, 'Ошибка загрузки данных из geoService');
            }
        });
        this.connectWebSocked('monitoring');
    },

    readCallsForHeatMap: function (station) {
        const callStore = this.getStore('Isidamaps.store.CallsFirstLoadStore'),
            paramsCalls = {
                stations: this.stationArray,
                statuses: ['COMPLETED']
            };
        station.forEach((st) => {
            this.stationArray.push(Ext.String.trim(st));
        });
        callStore.load({
            url: Ext.String.format(`${this.urlGeodata}/call`),
            params: paramsCalls,
        });
    },

    readMarkers: function (call, brigades) {
        const brigadeStore = this.getStore('Isidamaps.store.BrigadesFirstLoadStore'),
            callStore = this.getStore('Isidamaps.store.CallsFirstLoadStore');
        this.callId = call;
        this.brigadeId = brigades[0];
        const params = {
            callcardid: this.callId,
            brigades: this.brigadeId
        };
        Ext.log({outdent: 1}, `callId= ${call} , brigadeId= ${brigades}`);

        Ext.Ajax.request({
            url: `${this.urlGeodata}/brigade?`,
            params: params,
            method: 'GET',
            success: (response, opts) => {
                let obj = Ext.decode(response.responseText);
                callStore.add(obj.call);
                brigadeStore.add(obj.brigades);
                Ext.log({indent: 1}, `Load success from ${this.urlGeodata}/brigade?`);
            },

            failure: (response, opts) => {
                Ext.log({indent: 1, level: 'error'}, `server-side failure with status code ${response.status}`);
            }
        });
        this.connectWebSocked();
    },

    readMedOrg: function () {
        const medOrgStore = this.getStore('Isidamaps.store.MedOrgStore'),
            paramsHOSPITAL = {
                organizationtype: 'HOSPITAL'
            },
            paramsPOLYCLINIC = {
                organizationtype: 'POLYCLINIC'
            },
            paramsEMERGENCY_ROOM = {
                organizationtype: 'EMERGENCY_ROOM'
            },
            paramsArray = [paramsHOSPITAL, paramsPOLYCLINIC, paramsEMERGENCY_ROOM];

        paramsArray.forEach((params) => {
            Ext.Ajax.request({
                url: `${this.urlGeodata}/organization`,
                params: params,
                method: 'GET',

                success: (response, opts) => {
                    let obj = Ext.decode(response.responseText);
                    medOrgStore.add(obj);
                    Ext.log({indent: 1}, `Load success from ${this.urlGeodata}/brigade?`);
                },

                failure: (response, opts) => {
                    Ext.log({indent: 1, level: 'error'}, `server-side failure with status code ${response.status}`);
                }
            });
        });
    },

    readMarkersForCallHistory: function (call) {
        const callStore = this.getStore('Isidamaps.store.CallsFirstLoadStore'),
            brigadeStore = this.getStore('Isidamaps.store.BrigadesFirstLoadStore'),
            routeHistoryStore = this.getStore('Isidamaps.store.RouteHistoryStore'),
            factRouteHistoryStore = this.getStore('Isidamaps.store.FactRouteHistoryStore'),
            params = {
                callcardid: call
            };

        Ext.Ajax.request({
            url: `${this.urlGeodata}/route?`,
            params: params,
            method: 'GET',

            success: (response, opts) => {
                let obj = Ext.decode(response.responseText);
                callStore.add(obj.call);
                routeHistoryStore.add(obj.brigadeRoute);
                Ext.log({indent: 1}, `Load success from ${this.urlGeodata}/brigade?`);
            },

            failure: (response, opts) => {
                Ext.log({indent: 1, level: 'error'}, `server-side failure with status code ${response.status}`);
            }
        })
        ;
        Ext.Ajax.request({
            url: `${this.urlGeodata}/route/fact?`,
            params: params,
            method: 'GET',

            success: (response, opts) => {
                let obj = Ext.decode(response.responseText);
                brigadeStore.add([obj.endPoint, obj.startPoint]);
                factRouteHistoryStore.add(obj.points);
                callStore.add(obj.call);
                Ext.log({indent: 1}, `Load success from ${this.urlGeodata}/brigade?`);
            },

            failure: (response, opts) => {
                Ext.log({indent: 1, level: 'error'}, `server-side failure with status code ${response.status}`);
            }
        });

    },

    readMarkersBrigadeForAssign: function (call, brigades) {
        const callStore = this.getStore('Isidamaps.store.CallsFirstLoadStore'),
            brigadeStore = this.getStore('Isidamaps.store.BrigadesFirstLoadStore'),

            params = {
                callcardid: call,
                brigades: brigades
            };

        Ext.Ajax.request({
            url: `${this.urlGeodata}/brigade?`,
            params: params,
            method: 'GET',

            success: (response, opts) => {
                let obj = Ext.decode(response.responseText);
                callStore.add(obj.call);
                brigadeStore.add(obj.brigades);
                Ext.log({indent: 1}, `Load success from ${this.urlGeodata}/brigade?`);
            },

            failure: (response, opts) => {
                Ext.log({indent: 1, level: 'error'}, `server-side failure with status code ${response.status}`);
            }
        });
    },

    windowClose: function () {
        window.close();
    }
});