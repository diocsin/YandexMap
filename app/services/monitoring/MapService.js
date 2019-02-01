Ext.define('Isidamaps.services.monitoring.MapService', {
    map: null,
    objectManager: null,
    brigadesMarkers: [],
    callMarkers: [],
    filterBrigadeArray: [],
    filterCallArray: [],
    MyIconContentLayout: null,
    // ====
    getStoreMarkerInfo: Ext.emptyFn,
    setCheckbox: Ext.emptyFn,
    addNewButtonOnPanel: Ext.emptyFn,
    destroyButtonOnPanel: Ext.emptyFn,
    // ====

    constructor: function (options) {
        const me = this,
            bound = [
                [60.007645, 30.092139],
                [59.923862, 30.519157]];
        me.filterBrigadeArray = options.filterBrigadeArray;
        me.filterCallArray = options.filterCallArray;
        me.setCheckbox = options.setCheckbox;
        me.addNewButtonOnPanel = options.addNewButtonOnPanel;
        me.destroyButtonOnPanel = options.destroyButtonOnPanel;
        me.map = new ymaps.Map('mapId', {
            bounds: bound,
            controls: ['trafficControl']
        });
        me.map.behaviors.disable('dblClickZoom'); //отключение приближения при двойном клике по карте
        me.objectManager = new ymaps.ObjectManager({
            clusterize: false, //true
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

    optionsObjectManager: function () {
        const me = this;
        me.objectManager.objects.events.add(['click'], function (e) {
            let object = me.objectManager.objects.getById(e.get('objectId'));
            Ext.widget('callInfo').getController().markerClick(object);
        });
        /*me.objectManager.clusters.events.add(['click'], function (e) {
             var object = me.objectManager.clusters.getById(e.get('objectId'));
             me.clustersClick([e._sourceEvent.originalEvent.clientPixels[0] - 20, e._sourceEvent.originalEvent.clientPixels[1] + 20], object);
         });
         */
    },

    addMarkers: function () {
        const me = this;
        /*me.brigadesMarkers.forEach(function (brigade) {
            if (brigade.customOptions.status !== 'WITHOUT_SHIFT') {
                 me.objectManager.add(brigade);
            }
        });
        me.callMarkers.forEach(function (call) {
            if (call.customOptions.status !== 'COMPLETED') {
                 me.objectManager.add(call);
            }
        });*/
        me.map.geoObjects.add(me.objectManager);
        me.addButtonsBrigadeOnPanel();
        me.setCheckbox();

    },

    listenerWebSockedStore: function () {
        Ext.getStore('Isidamaps.store.BrigadeFromWebSockedStore').on('add', function (store, records, index) {
            this.createBrigadeOfSocked(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallFromWebSockedStore').on('add', function (store, records, index) {
            this.createCallOfSocked(records)
        }, this);
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('load', function (store, records, options) {
            this.storeBrigade(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('load', function (store, records, options) {
            this.storeCall(records)
        }, this);

    },

    addMarkersSocket: function (marker) {
        const me = this;
        if (marker.customOptions.objectType === 'BRIGADE') {
            let object = me.objectManager.objects.getById(marker.id);
            if (object) {
                me.objectManager.objects.remove(object);
            }
            if (!Ext.Array.contains(me.filterBrigadeArray, marker.customOptions.station) &&
                !Ext.Array.contains(me.filterBrigadeArray, marker.customOptions.status) &&
                !Ext.Array.contains(me.filterBrigadeArray, marker.customOptions.profile) &&
                marker.customOptions.status !== 'WITHOUT_SHIFT') {
                function func() {
                    me.objectManager.objects.add(marker);
                }

                setTimeout(func, 20);
            }
            return;
        }
        const object = me.objectManager.objects.getById(marker.id);
        if (object) {
            me.objectManager.remove(object);
        }

        if (!Ext.Array.contains(me.filterCallArray, marker.customOptions.station) &&
            !Ext.Array.contains(me.filterCallArray, marker.customOptions.status) &&
            marker.customOptions.status !== "COMPLETED") {
            me.objectManager.objects.add(marker);
        }

    },

    addButtonsBrigadeOnPanel: function () {
        Ext.fireEvent('addButtonsBrigadeOnPanel');
    },
    addStationFilter: function () {
        Ext.fireEvent('addStationFilter');
    },

    setStation: function (stations) {
        Isidamaps.app.getController('AppController').readStation(stations);
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
            me.addStationFilter();
            me.addMarkers();
            me.listenerWebSockedStore();
        }
    },

    createCallFeature: function (call) {
        return {
            type: 'Feature',
            id: call.get('callCardId'),
            customOptions: {
                objectType: call.get('objectType'),
                status: call.get('status'),
                callCardNum: call.get('callCardNum'),
                station: '' + call.get('station')
            },
            geometry: {
                type: 'Point',
                coordinates: [call.get('latitude'), call.get('longitude')]
            },
            options: {
                iconImageHref: 'resources/icon/' + call.get('iconName'),
                iconImageSize: [25, 31]
            }
        }
    },

    createBrigadeFeature: function (brigade) {
        const me = this;
        return {
            type: 'Feature',
            id: brigade.get('deviceId'),
            customOptions: {
                objectType: brigade.get('objectType'),
                profile: brigade.get('profile'),
                status: brigade.get('status'),
                station: '' + brigade.get('station'),
                brigadeNum: brigade.get('brigadeNum')
            },
            geometry: {
                type: 'Point',
                coordinates: [brigade.get('latitude'), brigade.get('longitude')]
            },
            options: {
                iconLayout: 'default#imageWithContent',
                iconImageHref: 'resources/icon/' + brigade.get('iconName'),
                iconContentLayout: me.MyIconContentLayout,
                iconImageOffset: [-24, -24],
                iconContentOffset: [30, -10],
            },
            properties: {
                hintContent: 'Бригада ' + brigade.get('brigadeNum'),
                iconContent: brigade.get('brigadeNum') + "(" + brigade.get('profile') + ")"
            }
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
            me.addStationFilter();
            me.addMarkers();
            me.listenerWebSockedStore();
        }
    },

    createCallOfSocked: function (calls) {
        const me = this,
            call = calls[0];
        if (call.get('latitude') && call.get('longitude')) {
            let marker = me.createCallFeature(call),
                callHas = Ext.Array.findBy(me.callMarkers, function (callInArray, index) {
                    if (callInArray.id === call.get('callCardId')) {
                        return callInArray;
                    }
                });
            Ext.Array.remove(me.callMarkers, callHas);
            if (call.get('status') !== 'COMPLETED') {
                Ext.Array.push(me.callMarkers, marker);
            }
            me.addMarkersSocket(marker);
            Ext.getStore('Isidamaps.store.CallFromWebSockedStore').clearData();
        }
    },

    createBrigadeOfSocked: function (brigades) {
        const me = this,
            brigade = brigades[0];
        if (brigade.get('latitude') && brigade.get('longitude') && brigade.get('status')) {
            let marker = me.createBrigadeFeature(brigade),
                brigadeHas = Ext.Array.findBy(me.brigadesMarkers, function (brigadeInArray, index) {
                    if (brigadeInArray.id === brigade.get('deviceId')) {
                        return brigadeInArray;
                    }
                });
            Ext.Array.remove(me.brigadesMarkers, brigadeHas);
            if (brigade.get('status') !== 'WITHOUT_SHIFT') {
                Ext.Array.push(me.brigadesMarkers, marker);
                if (brigadeHas && brigadeHas.customOptions.status !== marker.customOptions.status) {
                    Ext.fireEvent('getButtonBrigadeForChangeButton', marker, brigadeHas.customOptions.status);
                }
                else if (brigadeHas === null) {
                    me.addNewButtonOnPanel(marker);
                }
            }
            else {
                me.destroyButtonOnPanel(marker);
            }
            me.addMarkersSocket(marker, brigadeHas);
            Ext.getStore('Isidamaps.store.BrigadeFromWebSockedStore').clearData();
        }
    },

    resizeMap: function () {
        this.map.container.fitToViewport();
    }
})
;
