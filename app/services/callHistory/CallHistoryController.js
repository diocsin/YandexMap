Ext.define('Isidamaps.services.callHistory.CallHistoryController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.callhistory',
    CallHistory: null,
    createMap: function () {
        const me = this;
        me.CallHistory = Ext.create('Isidamaps.services.callHistory.MapService', {});
        me.CallHistory.listenerStore();
        me.CallHistory.optionsObjectManager();
        Isidamaps.app.getController('AppController').readMarkersForCallHistory('104055877');
        ASOV.setMapManager({
            setMarkers: me.CallHistory.setMarkers.bind(this)
        }, Ext.History.currentToken);

        const ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.CallHistory.resizeMap();
        });
    },
    layoutReady: function () {
        this.fireTabEvent(this.lookupReference('navigationPanel'));
    }
});
