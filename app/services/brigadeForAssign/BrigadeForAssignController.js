Ext.define('Isidamaps.services.brigadeForAssign.BrigadeForAssignController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.brigadeforassign',
    BrigadeForAssign: null,
    urlGeodata: null,
    listen: {
        global: {
            jsonAnswerReady: 'buttonChecked',
            checkedBrigadeForAssign: 'checkedBrigadeForAssign'
        }
    },

    checkedBrigadeForAssign: function () {
        const store =Ext.getStore('Isidamaps.store.RouteForTableStore');
        store.each(function (rec) {
            rec.set('checkBox', false);
        })
    },

    createMap: function () {
        var me = this;

        me.BrigadeForAssign = Ext.create('Isidamaps.services.brigadeForAssign.MapService', {});
        me.BrigadeForAssign.listenerStore();
        me.BrigadeForAssign.optionsObjectManager();
        Isidamaps.app.getController('AppController').readMarkersBrigadeForAssign('106198579', ['910','951','920']);
        ASOV.setMapManager({
            setMarkers: me.BrigadeForAssign.setMarkers.bind(this)
        }, Ext.History.currentToken);
        var ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.BrigadeForAssign.resizeMap();
        })
    },

    buttonChecked: function () {
        this.BrigadeForAssign.createAnswer();
    },
    layoutReady: function () {
        this.fireTabEvent(this.lookupReference('navigationPanel'));
    }
});
