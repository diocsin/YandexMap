Ext.define('Isidamaps.services.monitoringView.MapService', {
    map: null,
    objectManager: null,
    callsModel: null,
    viewModel: null,
    brigadesMarkers: [],
    callMarkers: [],
    filterBrigadeArray: [],
    filterCallArray: [],
    station: [],
    urlGeodata: null,
    MyIconContentLayout: null,
    // ====
    markerClick: Ext.emptyFn,
    clustersClick: Ext.emptyFn,
    getStoreMarkerInfo: Ext.emptyFn,
    // ====
    callInfoForm: [{
        xtype: 'form',
        height: '100%',
        width: '100%',
        margin: 0,
        items: [{
            xtype: 'displayfield',
            name: 'callCardNum',
            fieldLabel: 'Номер вызова',
            labelWidth: '100%',
            margin: 0
        },
            {
                xtype: 'displayfield',
                name: 'createTime',
                fieldLabel: 'Время создания вызова',
                labelWidth: '100%',
                renderer: Ext.util.Format.dateRenderer('Y-m-d, h:i:s'),
                margin: 0
            },
            {
                xtype: 'displayfield',
                name: 'regBeginTime',
                fieldLabel: 'Время приема вызова',
                labelWidth: '100%',
                renderer: Ext.util.Format.dateRenderer('Y-m-d, h:i:s'),
                margin: 0
            },
            {
                xtype: 'textareafield',
                name: 'reason',
                labelWidth: 100,
                width: 500,
                readOnly: true,
                fieldLabel: 'Повод к вызову',
                margin: '0px 0px 5px 0px'
            },
            {
                xtype: 'textareafield',
                name: 'reasonComment',
                labelWidth: 100,
                width: 500,
                readOnly: true,
                fieldLabel: 'Комментарий',
                margin: '5px 0px 0px 0px'
            },
            {
                xtype: 'displayfield',
                name: 'address',
                labelWidth: '100%',
                fieldLabel: 'Адрес места вызова',
                margin: 0
            },
            {
                xtype: 'displayfield',
                name: 'enter',
                labelWidth: '100%',
                fieldLabel: 'Особенности входа',
                margin: 0
            },
            {
                xtype: 'displayfield',
                name: 'phone',
                labelWidth: '100%',
                fieldLabel: 'Телефон',
                margin: 0
            },
            {
                xtype: 'displayfield',
                name: 'fullName',
                labelWidth: '100%',
                fieldLabel: 'ФИО',
                margin: 0
            },
            {
                xtype: 'displayfield',
                name: 'brigadeNum',
                labelWidth: '100%',
                fieldLabel: 'Номер бригады',
                margin: 0
            },
            {
                xtype: 'displayfield',
                name: 'brigadeAssignTime',
                labelWidth: '100%',
                fieldLabel: 'Время назначения бригады на вызов',
                renderer: Ext.util.Format.dateRenderer('Y-m-d, h:i:s'),
                margin: 0
            },
            {
                xtype: 'displayfield',
                name: 'brigadeArrivalTime',
                labelWidth: '100%',
                fieldLabel: 'Время прибытия бригады к месту вызова',
                renderer: Ext.util.Format.dateRenderer('Y-m-d, h:i:s'),
                margin: 0
            },
            {
                xtype: 'displayfield',
                name: 'hospital',
                labelWidth: '100%',
                fieldLabel: 'Стационар',
                margin: 0
            }
        ]
    }],
    constructor: function (options) {
        var me = this;
        me.markerClick = options.markerClick;
        me.clustersClick = options.clustersClick;
        me.viewModel = options.viewModel;
        me.boundsMap = options.boundsMap;
        me.filterBrigadeArray = options.filterBrigadeArray;
        me.filterCallArray = options.filterCallArray;
        me.urlGeodata = options.urlGeodata;
        me.getStoreMarkerInfo = options.getStoreMarkerInfo;
        me.map = new ymaps.Map('mapId-innerCt', {
            bounds: me.boundsMap,
            controls: ['trafficControl']
        });
        me.map.behaviors.disable('dblClickZoom'); //отключение приближения при двойном клике по карте
        me.objectManager = new ymaps.ObjectManager({
            clusterize: true,
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
        var me = this;
        me.objectManager.objects.events.add(['click'], function (e) {
            var object = me.objectManager.objects.getById(e.get('objectId')),
                storeMarker = me.getStoreMarkerInfo(object);
            me.markerClick(object, [e._sourceEvent.originalEvent.clientPixels[0], e._sourceEvent.originalEvent.clientPixels[1]], storeMarker);
        });
        me.objectManager.clusters.events.add(['click'], function (e) {
            var object = me.objectManager.clusters.getById(e.get('objectId'));
            me.clustersClick([e._sourceEvent.originalEvent.clientPixels[0] - 20, e._sourceEvent.originalEvent.clientPixels[1] + 20], object);
        });
    },

    addMarkers: function () {
        var me = this;
        me.brigadesMarkers.forEach(function (brigade) {
            if (brigade.customOptions.status !== 'WITHOUT_SHIFT') {
                me.objectManager.add(brigade);
            }
        });
        me.callMarkers.forEach(function (call) {
            if (call.customOptions.status !== 'COMPLETED') {
                me.objectManager.add(call);
            }
        });
        me.map.geoObjects.add(me.objectManager);
        me.addButtonsBrigadeOnPanel();
    },

    addMarkersSocket: function (marker) {
        var me = this;
        if (marker.customOptions.objectType === 'BRIGADE') {
            if (me.objectManager.objects.getById(marker.id) != null) {
                var t = me.objectManager.objects.getById(marker.id);
                me.objectManager.objects.remove(t);
                if (marker.customOptions.status === 'WITHOUT_SHIFT') {
                    me.addButtonsBrigadeOnPanel();
                }
            }
            if (me.filterBrigadeArray.indexOf(marker.customOptions.station) === -1 &&
                me.filterBrigadeArray.indexOf(marker.customOptions.status) === -1 &&
                me.filterBrigadeArray.indexOf(marker.customOptions.profile) === -1 &&
                marker.customOptions.status !== 'WITHOUT_SHIFT') {
                function func() {
                    me.objectManager.objects.add(marker);
                    Ext.fireEvent('getButtonBrigadeForChangeButton', marker);
                }

                setTimeout(func, 20);
            }
        }
        if (marker.customOptions.objectType === 'CALL') {

            if (marker.customOptions.status === "COMPLETED" || me.objectManager.objects.getById(marker.id) != null) {
                me.objectManager.remove(me.objectManager.objects.getById(marker.id));
            }

            if (me.filterCallArray.indexOf(marker.customOptions.status) === -1 &&
                me.filterCallArray.indexOf(marker.customOptions.station) === -1 &&
                marker.customOptions.status !== "COMPLETED") {
                me.objectManager.objects.add(marker);
            }
        }
    },

    addButtonsBrigadeOnPanel: function () {
        Ext.fireEvent('addButtonsBrigadeOnPanel');
    },
    addStationFilter: function () {
        Ext.fireEvent('addStationFilter');
    },

    setStation: function (station) {
        this.Monitoring.readStation(station);
    },

    storeCall: function (urlCall) {
        var me = this;
        Ext.create('Ext.data.Store', {
            model: 'Isidamaps.model.Call',
            proxy: {
                type: 'ajax',
                url: urlCall,
                reader: {
                    type: 'json'
                }
            },
            autoLoad: false
        }).load(function (records) {
            records.forEach(function (call) {
                if (call.get('latitude') !== undefined && call.get('longitude') !== undefined) {
                    me.callMarkers.push({
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
                            iconImageHref: 'resources/icon/' + call.get('iconName')
                        }
                    })
                }
            });
            me.addMarkers();
        })
    },

    storeBrigade: function (urlBrigade, urlCall) {
        var me = this;

        Ext.create('Ext.data.Store', {
            model: 'Isidamaps.model.Brigade',
            proxy: {
                type: 'ajax',
                url: urlBrigade,
                reader: {
                    type: 'json'
                }
            },
            autoLoad: false
        }).load(function (records) {
            records.forEach(function (brigade) {
                if (brigade.get('latitude') !== undefined && brigade.get('longitude') !== undefined) {
                    me.brigadesMarkers.push({
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
                    })
                }
            });
            me.addStationFilter();
            me.storeCall(urlCall);
        })
    },

    readStation: function (station) {
        var me = this;

        if (station !== undefined) {
            station.forEach(function (st) {
                me.station.push(Ext.String.trim(st));
            });
        }
        var t = Ext.Object.toQueryString({
                stations: me.station
            }),
            urlBrigade = Ext.String.format(me.urlGeodata + '/data?{0}&statuses=', t),
            urlCall = Ext.String.format(me.urlGeodata + '/call?{0}', t);
        me.brigadesMarkers = [];
        me.callMarkers = [];
        me.storeBrigade(urlBrigade, urlCall);
    },

    createMarkers: function () {
        var me = this,
            callRecords = me.viewModel.getStore('Calls').getData().items;
        callRecords.forEach(function (call) {
            me.callMarkers.forEach(function (callInArray) {
                if (callInArray.id === call.get('callCardId')) {
                    var index = me.callMarkers.indexOf(callInArray);
                    me.callMarkers.splice(index, 1);
                }
            });
            if (call.get('latitude') !== undefined && call.get('longitude') !== undefined) {
                var marker = {
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
                        iconImageHref: 'resources/icon/' + call.get('iconName')
                    }
                };
                if (call.get('status') !== 'COMPLETED') {
                    me.callMarkers.push(marker);
                }
            }
            me.addMarkersSocket(marker);
        });
        var brigadeRecords = me.viewModel.getStore('Brigades').getData().items;
        brigadeRecords.forEach(function (brigade) {
            me.brigadesMarkers.forEach(function (brigadeInArray) {
                if (brigadeInArray.id === brigade.get('deviceId')) {
                    var index = me.brigadesMarkers.indexOf(brigadeInArray);
                    me.brigadesMarkers.splice(index, 1);
                }
            });
            if (brigade.get('latitude') !== undefined && brigade.get('longitude') !== undefined) {
                var marker = {
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
                };
                if (brigade.get('status') !== 'WITHOUT_SHIFT') {
                    me.brigadesMarkers.push(marker);
                }
            }

            me.addMarkersSocket(marker);
        });
    },

    resizeMap: function () {
        this.map.container.fitToViewport();
    }
})
;
