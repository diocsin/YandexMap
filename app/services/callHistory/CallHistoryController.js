Ext.define('Isidamaps.services.callHistory.CallHistoryController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.callhistory',
    CallHistory: null,
    urlGeodata: null,
    listen: {
        global: {
            windowClose: 'windowClose'
        }
    },

    windowClose: function () {
        window.close();
    },

    createMap: function () {
        const me = this,
            bounds = [
                [60.007645, 30.092139],
                [59.923862, 30.519157]
            ];
        me.CallHistory = Ext.create('Isidamaps.services.callHistoryView.MapService', {
            viewModel: me.getViewModel(),
            markerClick: me.markerClick,
            clustersClick: me.clustersClick,
            boundsMap: bounds,
            urlGeodata: me.urlGeodata,
            getStoreMarkerInfo: me.getStoreMarkerInfo
        });
        me.CallHistory.optionsObjectManager();
        ASOV.setMapManager({
            setMarkers: me.CallHistory.setMarkers.bind(this)
        }, Ext.History.currentToken);

        const ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.CallHistory.resizeMap();
        });
    }
});
