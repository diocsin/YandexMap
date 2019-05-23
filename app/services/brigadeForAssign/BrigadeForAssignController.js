Ext.define('Isidamaps.services.brigadeForAssign.BrigadeForAssignController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.brigadeforassign',
    BrigadeForAssign: null,
    listen: {
        global: {
            jsonAnswerReady: 'buttonChecked',
            uncheckCheckboxes: 'uncheckCheckboxes',
            changeColorRoute: 'changeColorRoute',
            returnColorRoute: 'returnColorRoute'
        }
    },

    changeColorRoute: function (checkbox) {
        this.BrigadeForAssign.map.geoObjects.each(route => {
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
        this.BrigadeForAssign.map.geoObjects.each(route => {
            if (route.id === checkbox.id) {
                route.options.unset('routeActiveStrokeColor');
            }
        });
    },

    uncheckCheckboxes: function () {
        const store = Ext.getStore('Isidamaps.store.RouteForTableStore');
        store.each((rec) => {
            rec.set('checkBox', false);
        })
    },

    createClass: function () {
        this.BrigadeForAssign = Ext.create('Isidamaps.services.brigadeForAssign.MapService', {});
        this.BrigadeForAssign.listenerStore();
        this.BrigadeForAssign.optionsObjectManager();
        ASOV.setMapManager({
            setMarkers: this.BrigadeForAssign.setMarkers.bind(this)
        }, Ext.History.currentToken);
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
            this.BrigadeForAssign.resizeMap();
        })
    },

    buttonChecked: function () {
        this.BrigadeForAssign.sendAnswerInASOV();
    }
});
