Ext.define('Isidamaps.services.callHistory.CallHistoryController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.callhistory',
    CallHistory: null,

    createClass: function () {
        const grid = Ext.getCmp('GridHistory');
        grid.el.mask('Загрузка данных');
        this.CallHistory = Ext.create('Isidamaps.services.callHistory.MapService', {});
        this.CallHistory.listenerStore();
        this.CallHistory.optionsObjectManager();
        ASOV.setMapManager({
            setMarkers: this.CallHistory.setMarkers.bind(this)
        }, Ext.History.currentToken);
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
            this.CallHistory.resizeMap();
        });
    }

});
