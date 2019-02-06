Ext.define('Isidamaps.services.brigadeForAssign.BrigadeForAssignController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.brigadeforassign',
    BrigadeForAssign: null,
    listen: {
        global: {
            jsonAnswerReady: 'buttonChecked',
            checkedBrigadeForAssign: 'checkedBrigadeForAssign',
            changeColorRoute: 'changeColorRoute',
            returnColorRoute: 'returnColorRoute'
        }
    },

    changeColorRoute: function (checkbox) {
        const me = this;
        me.BrigadeForAssign.map.geoObjects.each(function (route) {
            if (route.id === checkbox.id) {
                route.options.set({
                    routeActiveStrokeColor: "#ff0019",
                    zIndex: 5000
                });
            }
            else {
                route.options.unset('routeActiveStrokeColor');
                route.options.unset('zIndex');
            }
        });
    },

    returnColorRoute: function (checkbox) {
        const me = this;
        me.BrigadeForAssign.map.geoObjects.each(function (route) {
            if (route.id === checkbox.id) {
                route.options.unset('routeActiveStrokeColor');
            }
        });
    },

    checkedBrigadeForAssign: function () {
        const store = Ext.getStore('Isidamaps.store.RouteForTableStore');
        store.each(function (rec) {
            rec.set('checkBox', false);
        })
    },

    createClass: function () {
        const me = this;
        me.BrigadeForAssign = Ext.create('Isidamaps.services.brigadeForAssign.MapService', {});
        me.BrigadeForAssign.listenerStore();
        me.BrigadeForAssign.optionsObjectManager();
        ASOV.setMapManager({
            setMarkers: me.BrigadeForAssign.setMarkers.bind(this)
        }, Ext.History.currentToken);
        const ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.BrigadeForAssign.resizeMap();
        })
    },

    buttonChecked: function () {
        this.BrigadeForAssign.createAnswer();
    }
});
