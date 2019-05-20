Ext.define('Isidamaps.services.hospitalForAssign.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    myMask: null,
    callMarkers: [],
    hospitalMarkers: [],
    arrRoute: [],

    constructor: function (options) {
    },

    callback: function () {
        if (this.arrRoute.length === this.hospitalMarkers.length) {
            ASOV.setHospital(this.arrRoute);
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
            this.arrRoute.push({
                hospitalId: id,
                distance: (route.getLength() / 1000).toFixed(1),
                time: (route.getJamsTime() / 60).toFixed(0),
            }).then(this.callback());
        })
    },

    setMarkers: function (points) {
        console.dir(points);
        this.myMask = new Ext.LoadMask({
            msg: 'Подождите пожалуйста. Загрузка...',
            target: Ext.getCmp('hospitalforassignPanel')
        });
        this.myMask.show();
        if (points.length === 0) {
            ASOV.setHospital(this.arrRoute);
            return;
        }
        points.forEach((point) => {
            if (!isNaN(parseFloat(point.point1[0])) && !isNaN(parseFloat(point.point1[1])) && !isNaN(parseFloat(point.point2[0])) && !isNaN(parseFloat(point.point2[1])) &&
                parseFloat(point.point1[0]) !== 0 && parseFloat(point.point1[1]) !== 0 && parseFloat(point.point2[0]) !== 0 && parseFloat(point.point2[1]) !== 0) {
                this.HospitalForAssign.hospitalMarkers.push(point);
            }
        });
        this.HospitalForAssign.hospitalMarkers.forEach((point) => {
            this.HospitalForAssign.createRoute(point.point1, point.point2, point.id);
        });
    }

});
