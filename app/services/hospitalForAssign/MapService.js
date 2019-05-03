Ext.define('Isidamaps.services.hospitalForAssign.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    callMarkers: [],
    hospitalMarkers: [],
    arrRoute: [],

    constructor: function (options) {
        this.createMap();
    },

    callback: function () {
        if (this.arrRoute.length === this.hospitalMarkers.length) {
            console.dir(this.arrRoute);
            //ASOV.setRoutes(this.arrRoute);
        }
    },

    createRoute: function (callCoordinates, hospitalCoordinates, id) {
        ymaps.route([callCoordinates, hospitalCoordinates], {
            avoidTrafficJams: true,
        }).then((route) => {
            route.getWayPoints().options.set({
                iconLayout: 'default#image',
                iconImageHref: false,
                hasBalloon: true,
                zIndex: 1
            });
            route.id = id;
            route.getPaths().options.set({
                opacity: 0.9,
                strokeWidth: 4
            });
                this.map.geoObjects.add(route);
            this.arrRoute.push({
                hospitalId: id,
                distance: (route.getLength() / 1000).toFixed(1),
                time: (route.getJamsTime() / 60).toFixed(0),
            }).then(this.callback());
        })
    },

    setMarkers: function (call, hospital) {
        call = ['59.90', '30.29'];
        hospital = [['10', '59.9', '30.9'], ['2', '59.1', '30.1'], ['3', '59.6', '30.5']];

        this.hospitalMarkers = hospital;

        this.hospitalMarkers.forEach((hos) => {
            this.createRoute(call, [hos[1], hos[2]], hos[0])
        })
    }

});
