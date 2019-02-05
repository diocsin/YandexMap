Ext.define('Isidamaps.services.brigadeForAssign.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    objectManager: null,
    callMarkers: [],
    brigadesMarkers: [],
    arrRoute: [],
    arrpoints: [],
    arrRouteForTable: [],
    MyIconContentLayout: null,

    constructor: function (options) {
        const me = this,
            bounds = [
                [60.007645, 30.092139],
                [59.923862, 30.519157]
            ];
        me.map = new ymaps.Map('mapId', {
            bounds: bounds,
            controls: ['trafficControl']
        });
        me.map.behaviors.disable('dblClickZoom'); //отключение приближения при двойном клике по карте
        me.objectManager = new ymaps.ObjectManager({
            clusterize: false,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false
        });
        me.objectManager.objects.options.set({
            iconLayout: 'default#image',
            zIndex: 2000,
            iconImageSize: [40, 40]

        });
        me.objectManager.clusters.options.set({
            zIndex: 3000,
            groupByCoordinates: true
        });
        me.MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #000000;  border: 1px solid; display: inline-block; background-color: #faf8ff; text-align: center; border-radius: 6px; z-index: 2;font-size: 12pt">$[properties.iconContent]</div>'
        );
    },

    optionsObjectManager: function () {
        const me = this;
        me.objectManager.objects.events.add(['click'], function (e) {
            let object = me.objectManager.objects.getById(e.get('objectId'));
            Ext.widget('callInfo').getController().markerClick(object);
        });

    },

    callback: function () {
        const me = this;
        if (me.arrRoute.length === me.brigadesMarkers.length) {
            ASOV.setRoutes(me.arrRoute);
        }
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('add', function (store, records, options) {
            this.storeBrigade(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('add', function (store, records, options) {
            this.storeCall(records)
        }, this);

    },

    storeCall: function (records) {
        const me = this;
        Ext.Array.clean(me.callMarkers);
        records.forEach(function (call) {
            if (call.get('latitude') && call.get('longitude')) {
                const feature = me.createCallFeature(call);
                me.callMarkers.push(feature);
            }
        });
        if (me.brigadesMarkers.length !== 0) {
            me.addMarkers();
        }
    },

    storeBrigade: function (records) {
        const me = this;
        Ext.Array.clean(me.brigadesMarkers);
        records.forEach(function (brigade) {
            if (brigade.get('latitude') && brigade.get('longitude')) {
                const feature = me.createBrigadeFeature(brigade);
                me.brigadesMarkers.push(feature);
            }
        });
        if (me.callMarkers.length !== 0) {
            me.addMarkers();
        }
    },

    addMarkers: function () {
        const me = this;
        if (me.callMarkers.length === 0) {
            me.createCallAlert();
        }
        me.createBouns();
        me.brigadesMarkers.forEach(function (brigadeMarker) {
            me.createRoute(me.callMarkers[0], brigadeMarker);
        });
        me.objectManager.add(me.brigadesMarkers);
        me.objectManager.add(me.callMarkers);
        me.map.geoObjects.add(me.objectManager);
    },


    createAnswer: function () {
        const store = Ext.getStore('Isidamaps.store.RouteForTableStore'),
            br = store.query('checkBox', 'true'),
            brigadeId = br.getValues('brigadeId', 'data');
        if (brigadeId.length === 1) {
            ASOV.setBrigade(brigadeId[0]);
        } else (Ext.create('Ext.window.MessageBox').show({
            title: 'Ошибка',
            message: 'Не назначена бригада на вызов',
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        }))
    },

    createCallAlert: function () {
        Ext.create('Ext.window.MessageBox').show({
            title: 'Ошибка',
            message: 'Нет координат вызова',
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        })
    },

    createRoute: function (call, brigade) {
        const me = this;
        let routeList = null;
        console.dir(brigade.customOptions.brigadeNum);
        ymaps.route([brigade.geometry.coordinates, call.geometry.coordinates], {
            avoidTrafficJams: true,
        }).then(function (route) {
            route.getWayPoints().options.set({
                iconLayout: 'default#image',
                iconImageHref: false,
                hasBalloon: true,
                zIndex: 1
            });
            route.id = brigade.id;
            route.getPaths().options.set({
                opacity: 0.9,
                balloonContentLayout:ymaps.templateLayoutFactory.createClass('Маршрут '+brigade.customOptions.brigadeNum+' бригады'),
                strokeWidth: 4
            });
            me.map.geoObjects.add(route);
            routeList = {
                brigade: brigade,
                route: route
            };
            me.arrRouteForTable.push(routeList);
            for (let i = 0; i < route.getPaths().getLength(); i++) {
                let way = route.getPaths().get(i),
                    segments = way.getSegments();
                for (let j = 0; j < segments.length; j++) {
                    let point = segments[j].getCoordinates();
                    me.arrpoints.push(
                        [point[0][0], point[0][1]]
                    );
                }
                me.arrpoints.unshift(brigade.geometry.coordinates);
                me.arrpoints.push(call.geometry.coordinates);
            }
            me.arrRoute.push({
                brigadeId: brigade.id,
                objectType: brigade.customOptions.objectType,
                profile: brigade.customOptions.profile,
                brigadeNum: brigade.customOptions.brigadeNum,
                longitude: brigade.geometry.coordinates[1],
                latitude: brigade.geometry.coordinates[0],
                distance: (route.getLength() / 1000).toFixed(1),
                time: (route.getJamsTime() / 60).toFixed(0),
                route: me.arrpoints
            }).then(me.createTableRoute(), me.callback(), me.arrpoints = []);
        })
    },

    setMarkers: function (call, brigades) {
        Isidamaps.app.getController('AppController').readMarkersBrigadeForAssign(call, brigades);
    }

});
