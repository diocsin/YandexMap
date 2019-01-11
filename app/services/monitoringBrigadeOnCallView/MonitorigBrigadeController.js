Ext.define('Isidamaps.services.monitoringBrigadeOnCallView.MonitoringBrigadeController', {
    extend: 'Isidamaps.services.monitoringView.MonitoringController',
    alias: 'controller.monitoringBrigade',
    MonitoringBrigade: null,
    stompClient: null,
    urlGeodata: null,
    urlWebSocket: null,
    listen: {
        global: {
            windowClose: 'windowClose'
        }
    },

    mainBoxReady: function () {
        var me = this,
            property = me.getViewModel().getStore('Property');
        property.load(function (records) {
            records.forEach(function (data) {
                me.urlGeodata = data.get('urlGeodata');
                me.urlWebSocket = data.get('urlWebSocket');
            });
            ymaps.ready(function () {
                me.createMap();
            });
        });
    },

    windowClose: function () {
        window.close();
    },

    connect: function () {
        var me = this,
            socket = new SockJS(me.urlWebSocket + '/geo');
        me.stompClient = Stomp.over(socket);
        me.stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            me.stompClient.subscribe('/geo-queue/geodata-updates', function (greeting) {
                me.showGreeting(JSON.parse(greeting.body));
            });
        });
    },

    showGreeting: function (message) {
        var me = this;
        message.deviceId = '' + message.deviceId;
        if (message.objectType === 'BRIGADE') {
            if (me.MonitoringBrigade.brigadeId === message.deviceId) {
                Ext.log({msg: 'Бригада пришла по вебСокету ', level: 'info', stack: false, dump: message});
                var storeBrigades = me.getViewModel().getStore('Brigades');
                storeBrigades.add(message);
            }
        }

        if (message.objectType === 'CALL') {
            if (me.MonitoringBrigade.callId === message.deviceId) {
                Ext.log({msg: 'Вызов пришел по вебСокету ', level: 'info', stack: false, dump: message});
                var storeCalls = me.getViewModel().getStore('Calls');
                storeCalls.add(message);
            }
        }
    },

    sendName: function () {
        //stompClient.send("/app/hello", {}, JSON.stringify({ 'name': name }));
    },

    disconnect: function () {
        stompClient.disconnect();
        console.log("Disconnected");
    },

    createMap: function () {
        var me = this,
            bounds = [
                [60.007645, 30.092139],
                [59.923862, 30.519157]
            ];
        me.connect();
        me.MonitoringBrigade = Ext.create('Isidamaps.services.monitoringBrigadeOnCallView.MapService', {
            viewModel: me.getViewModel(),
            markerClick: me.markerClick,
            boundsMap: bounds,
            urlGeodata: me.urlGeodata,
            getStoreMarkerInfo: me.getStoreMarkerInfo
        });
        me.MonitoringBrigade.optionsObjectManager();
        ASOV.setMapManager({
            setMarkers: me.MonitoringBrigade.setMarkers.bind(this)
        }, Ext.History.currentToken);

        var ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.MonitoringBrigade.resizeMap();
        });

    },


    layoutReady: function () {
        this.fireTabEvent(this.lookupReference('RouteBrigadePanel'));
    },

    tabChange: function (panel, newTab, oldTab) {
        oldTab.fireEvent('tabExit');
        this.fireTabEvent(newTab);
    },

    fireTabEvent: function (tab) {
        tab.fireEvent('tabEnter');
    }

});
