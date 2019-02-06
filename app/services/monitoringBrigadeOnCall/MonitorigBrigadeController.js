Ext.define('Isidamaps.services.monitoringBrigadeOnCall.MonitoringBrigadeController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.monitoringBrigade',
    MonitoringBrigade: null,

    createClass: function () {
        const me = this;
        me.MonitoringBrigade = Ext.create('Isidamaps.services.monitoringBrigadeOnCall.MapService', {});
        me.MonitoringBrigade.listenerStore();
        me.MonitoringBrigade.optionsObjectManager();
        ASOV.setMapManager({
            setMarkers: me.MonitoringBrigade.setMarkers.bind(this)
        }, Ext.History.currentToken);
        const ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.MonitoringBrigade.resizeMap();
        });

    }

});
