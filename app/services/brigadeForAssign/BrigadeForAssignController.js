Ext.define('Isidamaps.services.brigadeForAssign.BrigadeForAssignController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.brigadeforassign',
    BrigadeForAssign: null,
    urlGeodata: null,
    listen: {
        global: {
            jsonAnswerReady: 'buttonCheked',
            checkedBrigadeForAssign: 'checkedBrigadeForAssign'
        }
    },

    checkedBrigadeForAssign: function () {
        var me = this,
            store = me.getViewModel().getStore('Routes');
        store.each(function (rec) {
            rec.set('checkBox', false);
        })
    },

    createMap: function () {
        var me = this,
            bounds = [
                [60.007645, 30.092139],
                [59.923862, 30.519157]
            ];
        me.BrigadeForAssign = Ext.create('Isidamaps.services.brigadeForAssignView.MapService', {
            viewModel: me.getViewModel(),
            markerClick: me.markerClick,
            clustersClick: me.clustersClick,
            boundsMap: bounds,
            urlGeodata: me.urlGeodata,
            getStoreMarkerInfo: me.getStoreMarkerInfo
        });
        ASOV.setMapManager({
            setMarkers: me.BrigadeForAssign.setMarkers.bind(this)
        }, Ext.History.currentToken);
        var ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.BrigadeForAssign.resizeMap();
        })
    },

    buttonCheked: function () {
        this.BrigadeForAssign.createAnswer();
    }
});
