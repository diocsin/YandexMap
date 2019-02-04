Ext.define('Isidamaps.services.monitoringBrigadeOnCall.MonitoringBrigadeController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.monitoringBrigade',
    MonitoringBrigade: null,

    createMap: function () {
        const me = this;
        me.MonitoringBrigade = Ext.create('Isidamaps.services.monitoringBrigadeOnCall.MapService', {});
        me.MonitoringBrigade.listenerStore();
        me.MonitoringBrigade.optionsObjectManager();
        Isidamaps.app.getController('AppController').readMarkers('105711138', ['910']);
        ASOV.setMapManager({
            setMarkers: me.MonitoringBrigade.setMarkers.bind(this)
        }, Ext.History.currentToken);

        const ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.MonitoringBrigade.resizeMap();
        });

    },

    layoutReady: function () {
        this.fireTabEvent(this.lookupReference('RouteBrigadePanel'));
    }

});
