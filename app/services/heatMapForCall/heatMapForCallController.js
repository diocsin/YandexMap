Ext.define('Isidamaps.services.heatMapForCall.heatMapForCallController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.heatMapForCall',

    createClass: function () {
        const me = this,
            HeatMapForCall = Ext.create('Isidamaps.services.heatMapForCall.MapService', {
            });
        HeatMapForCall.optionsObjectManager();
        HeatMapForCall.listenerStore();
        Isidamaps.app.getController('AppController').initial(f);

        function f() {
            Isidamaps.app.getController('AppController').readCallsForHeatMap(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
        }

        const ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            HeatMapForCall.resizeMap();
        });
    },

    layoutReady: function () {
    },

    tabChange: function (panel, newTab, oldTab) {
    },

    fireTabEvent: function (tab) {
    },
});
