Ext.define('Isidamaps.services.heatMapForCall.HeatMapForCallController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.heatMapForCall',

    createClass: function () {
        const myMask = new Ext.LoadMask({
                msg: 'Подождите пожалуйста. Загрузка...',
                target: Ext.getCmp('heatMapForCallPanel')
            }),
            HeatMapForCall = Ext.create('Isidamaps.services.heatMapForCall.MapService', {
                myMask: myMask
            }),
            readCalls = () => {
                Isidamaps.app.getController('AppController').readCallsForHeatMap(['9'])
            };

        myMask.show();
        HeatMapForCall.optionsObjectManager();
        HeatMapForCall.listenerStore();
        Isidamaps.app.getController('AppController').initial(readCalls);


        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
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
