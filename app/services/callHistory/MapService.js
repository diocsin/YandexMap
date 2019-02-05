Ext.define('Isidamaps.services.callHistory.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    objectManager: null,
    callMarker: null,
    callMarkers: [],
    brigadeRoute: null,
    brigadesMarkers: [],
    factRoute: null,
    brigadesStartPoint: null,
    brigadesEndPoint: null,
    arrRouteForTable: [],
    callMarkersFactRoute: [],
    MyIconContentLayout: null,


    constructor: function (options) {
        var me = this,
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
        me.map.geoObjects.add(me.objectManager);

    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('add', function (store, records, options) {
            this.storeFactHistoryCall(records)
        }, this);
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('add', function (store, records, options) {
            this.storeFactHistoryBrigade(records)
        }, this);
        Ext.getStore('Isidamaps.store.RouteHistoryStore').on('add', function (store, records, options) {
            this.storeRouteHistory(records)
        }, this);
        Ext.getStore('Isidamaps.store.FactRouteHistoryStore').on('add', function (store, records, options) {
            this.storeFactRouteHistory(records)
        }, this);
    },

    storeFactHistoryCall: function (rec) {
        const me = this;
        rec.forEach(function (call) {
            if (call.get('latitude') && call.get('longitude')) {
                const feature = me.createCallFeature(call);
                me.callMarkers.push(feature);
                me.callMarkers.length === 1 ? me.objectManager.add(feature) : me.createBouns();
            }
        });
    },

    storeFactHistoryBrigade: function (rec) {
        const me = this;
        let i = 1;
        rec.forEach(function (brigade) {
            if (brigade.get('latitude') && brigade.get('longitude')) {
                brigade.data.deviceId = i++;
                const feature = me.createBrigadeFeature(brigade);
                me.brigadesMarkers.push(feature);
                me.objectManager.add(feature);
            }
        });
    },

    storeRouteHistory: function (records) {
        const me = this;
        let routeList = null;
        records.forEach(function (b) {
            routeList = Ext.decode(b.get('routeList'));
            me.createPolylineRoute(routeList);
            routeList.forEach(function (brigade) {
                if (brigade.latitude && brigade.longitude) {
                    const feature = {
                        type: 'Feature',
                        id: brigade.brigadeId,
                        customOptions: {
                            objectType: brigade.objectType,
                            brigadeNum: brigade.brigadeNum,
                            profile: brigade.profile
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [brigade.latitude, brigade.longitude]
                        },
                        options: {
                            iconLayout: 'default#imageWithContent',
                            iconImageHref: 'resources/icon/' + brigade.iconName,
                            iconContentLayout: me.MyIconContentLayout,
                            iconImageOffset: [-24, -24],
                            iconContentOffset: [30, -10],
                        },
                        properties: {
                            iconContent: brigade.brigadeNum + "(" + brigade.profile + ")"
                        }
                    };
                    me.brigadesMarkers.push(feature);
                    me.objectManager.add(feature);
                }
            })
        });
    },

    createPolylineRoute: function (routeList) {
        var me = this;

        me.arrRouteForTable = routeList;
        routeList.forEach(function (routes) {
            console.dir(routes);
            var polyline = new ymaps.Polyline(routes.route, {}, {
                draggable: false,
                strokeColor: '#000000',
                strokeWidth: 3
            });
            me.map.geoObjects.add(polyline);
        });
        me.createTableRoute();
    },

    storeFactRouteHistory: function (records) {
        var me = this,
            arrayLine = [];
        records.forEach(function (b) {
            arrayLine.push([b.get('latitude'), b.get('longitude')]);
        });
        var polyline = new ymaps.Polyline(arrayLine, {}, {
            draggable: false,
            strokeColor: '#FF0000',
            strokeWidth: 4,
            strokeStyle: '3 2'
        });
        me.map.geoObjects.add(polyline);
    },

    setMarkers: function (call) {
        Isidamaps.app.getController('AppController').readMarkersForCallHistory(call);
    },

    createTableRoute: function () {
        const me = this,
            store = Ext.getStore('Isidamaps.store.RouteForTableStore');
        me.arrRouteForTable.forEach(function (object) {
            const x = Ext.create('Isidamaps.model.Route');
            x.set('brigadeId', object.brigadeId);
            x.set('brigadeNum', object.brigadeNum);
            x.set('profile', object.profile);
            x.set('distance', object.distance);
            x.set('time', object.time);
            store.add(x);
        });
    }
});