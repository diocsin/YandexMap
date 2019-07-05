Ext.define('Isidamaps.services.factRouteHistory.FactRouteHistoryController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.factroutehistory',
    FactRouteHistory: null,

    createClass: function () {
        const grid = Ext.getCmp('GridHistory');
        grid.el.mask('Загрузка данных');
        this.FactRouteHistory = Ext.create('Isidamaps.services.factRouteHistory.MapService', {});
        this.FactRouteHistory.listenerStore();
        this.FactRouteHistory.optionsObjectManager();
        ASOV.setMapManager({
            setMarkers: this.FactRouteHistory.setMarkers.bind(this)
        }, Ext.History.currentToken);
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
            this.FactRouteHistory.resizeMap();
        });
    },
    fireTabEvent: function (tab) {
    },

    layoutReady: function () {
        setTimeout(function(){
            Ext.get('loading').remove();
            Ext.get('loading-mask').fadeOut({remove:true});
        }, 250);
    },
});