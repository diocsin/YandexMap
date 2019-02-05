Ext.define('Isidamaps.services.monitoringBrigadeOnCall.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    brigadesMarkers: [],
    callMarkers: [],
    arrRouteForTable: [],
    MyIconContentLayout: null,

    createRoute: function (call, brigade) {
        const me = this;
        let routeList = null;
        ymaps.route([brigade.geometry.coordinates, call.geometry.coordinates], {
            avoidTrafficJams: true
        }).then(function (route) {
            route.getWayPoints().options.set({
                iconLayout: 'default#image',
                iconImageHref: false,
                hasBalloon: false,
                zIndex: 1
            });
            route.getPaths().options.set({
                opacity: 0.9,
                strokeWidth: 4
            });
            me.map.geoObjects.add(route);
            routeList = {
                brigade: brigade,
                route: route
            };
            me.arrRouteForTable.push(routeList);
            me.createTableRoute();

        })
    },

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
        me.MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #000000;  border: 1px solid; display: inline-block; background-color: #faf8ff; text-align: center; border-radius: 6px; z-index: 2;font-size: 12pt">$[properties.iconContent]</div>'
        );
    },

    addMarkers: function () {
        const me = this;
        if (me.callMarkers.length === 0) {
            me.createCallAlert();
        }
        me.createBouns();
        me.objectManager.add(me.brigadesMarkers);
        me.objectManager.add(me.callMarkers);
        me.map.geoObjects.add(me.objectManager);
        if (me.callMarkers.length > 0 && me.brigadesMarkers.length > 0) {
            me.brigadesMarkers.forEach(function (brigadeMarker) {
                me.createRoute(me.callMarkers[0], brigadeMarker);
            });
        }
        me.listenerStore();
    },

    createCallAlert: function () {
        Ext.create('Ext.window.MessageBox').show({
            title: 'Ошибка',
            message: 'Нет координат вызова',
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        })
    },

    addMarkersSocket: function (marker) {
        const me = this,
        object = me.objectManager.objects.getById(marker.id);
        if (marker.customOptions.objectType === 'BRIGADE') {
            if (object) {
                me.objectManager.objects.remove(object);
            }

            function func() {
                me.objectManager.objects.add(marker);
                me.map.geoObjects.each(function (route) {
                    if (route.requestPoints !== undefined) {
                        me.map.geoObjects.remove(route);
                        return
                    }
                });
                me.createRoute(me.callMarkers[0], marker);
            }
            setTimeout(func, 1);
            return;
        }
        if (object) {
            me.objectManager.remove(object);
        }

        function func() {
            me.objectManager.objects.add(marker);
            me.map.geoObjects.each(function (route) {
                if (route.requestPoints !== undefined) {
                    me.map.geoObjects.remove(route);
                    return
                }
            });
            me.createRoute(marker, me.brigadesMarkers[0]);
        }

        setTimeout(func, 1);
    },

    setMarkers: function (call, brigades) {
        Isidamaps.app.getController('AppController').readMarkers(call, brigades);
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('add', function (store, records, options) {
            this.storeBrigade(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('add', function (store, records, options) {
            this.storeCall(records)
        }, this);

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
            me.listenerWebSockedStore();
        }
    },

    createBrigadeOfSocked: function (brigades) {
        const me = this,
            brigade = brigades[0];
        if (brigade.get('latitude') && brigade.get('longitude') && brigade.get('status')) {
            let marker = me.createBrigadeFeature(brigade);
            me.addMarkersSocket(marker);
            Ext.getStore('Isidamaps.store.BrigadeFromWebSockedStore').clearData();
        }
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
            me.listenerWebSockedStore();
        }
    },

    resizeMap: function () {
        this.map.container.fitToViewport();
    }
});
