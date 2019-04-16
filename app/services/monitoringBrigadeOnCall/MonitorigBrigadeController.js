Ext.define('Isidamaps.services.monitoringBrigadeOnCall.MonitoringBrigadeController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.monitoringBrigade',
    MonitoringBrigade: null,

    createClass: function () {
        this.MonitoringBrigade = Ext.create('Isidamaps.services.monitoringBrigadeOnCall.MapService', {});
        this.MonitoringBrigade.listenerStore();
        this.MonitoringBrigade.optionsObjectManager();
        ASOV.setMapManager({
            setMarkers: this.MonitoringBrigade.setMarkers.bind(this)
        }, Ext.History.currentToken);
        this.MonitoringBrigade.setMarkers('109459881', ['959']);
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
            this.MonitoringBrigade.resizeMap();
        });

    }

});
