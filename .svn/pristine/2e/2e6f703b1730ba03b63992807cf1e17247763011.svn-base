Ext.define('Isidamaps.services.monitoringView.MonitoringController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monitoring',
    Monitoring: null,
    filterBrigadeArray: [],
    filterCallArray: [],
    stompClient: null,
    urlGeodata: null,
    urlWebSocket: null,
    listen: {
        global: {
            checkedProfileBrigade: 'checkedProfileBrigade',
            checkedStatusBrigade: 'checkedStatusBrigade',
            checkedStationBrigade: 'checkedStationBrigade',
            checkedCallStatus: 'checkedCallStatus',
            addButtonsBrigadeOnPanel: 'addButtonsBrigadeOnPanel',
            addStationFilter: 'addStationFilter'
        }
    },

    checkedCallStatus: function (checkbox) {
        var me = this,
            checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            stBf = this.lookupReference('callStatusFilter');
        if (checkboxChecked === false) {
            me.filterCallArray.push(checkboxValue);
            var i = 0;
            stBf.items.each(function (checkbox) {
                if (checkbox.checked === true) {
                    i++
                }
            });
            if (stBf.items.length === i + 1) {
                me.lookupReference('allCalls').setValue(false)
            }
            me.Monitoring.callMarkers.forEach(function (call) {
                if (checkboxValue === call.customOptions.status) {
                    me.Monitoring.objectManager.objects.remove(call);
                }
            })
        }
        if (checkboxChecked === true) {
            var index = me.filterCallArray.indexOf(checkboxValue),
                j = 0;
            me.filterCallArray.splice(index, 1);
            me.Monitoring.callMarkers.forEach(function (call) {
                if (checkboxValue === call.customOptions.status) {
                    if (me.filterCallArray.indexOf(call.customOptions.station) === -1) {
                        me.Monitoring.objectManager.objects.add(call);
                    }
                }
            });
            stBf.items.each(function (checkbox) {
                if (checkbox.checked === true) {
                    j++
                }
            });
            if (stBf.items.length === j) {
                me.lookupReference('allCalls').setValue(true)
            }
        }
    },

    checkedStationBrigade: function (checkbox) {
        var me = this,
            checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            stationFilter = this.lookupReference('stationFilter');
        if (checkboxChecked === false) {
            me.filterCallArray.push(checkboxValue);
            me.filterBrigadeArray.push(checkboxValue);
            var i = 0;
            stationFilter.items.each(function (checkbox) {
                if (checkbox.checked === true) {
                    i++
                }
            });
            if (stationFilter.items.length === i + 1) {
                me.lookupReference('allStation').setValue(false)
            }
            me.Monitoring.brigadesMarkers.forEach(function (brigade) {
                if (checkboxValue === brigade.customOptions.station) {
                    me.Monitoring.objectManager.objects.remove(brigade);
                }
            });
            me.Monitoring.callMarkers.forEach(function (call) {
                if (checkboxValue === call.customOptions.station) {
                    me.Monitoring.objectManager.objects.remove(call);
                }
            })
        }
        if (checkboxChecked === true) {
            var indexBrigade = me.filterBrigadeArray.indexOf(checkboxValue),
                indexCall = me.filterCallArray.indexOf(checkboxValue),
                j = 0;
            me.filterBrigadeArray.splice(indexBrigade, 1);
            me.filterCallArray.splice(indexCall, 1);
            me.Monitoring.brigadesMarkers.forEach(function (brigade) {
                if (checkboxValue === brigade.customOptions.station) {
                    if (me.filterBrigadeArray.indexOf(brigade.customOptions.status) === -1 && me.filterBrigadeArray.indexOf(brigade.customOptions.profile) === -1) {
                        me.Monitoring.objectManager.objects.add(brigade);
                    }
                }
            });
            me.Monitoring.callMarkers.forEach(function (call) {
                if (checkboxValue === call.customOptions.station) {
                    if (me.filterCallArray.indexOf(call.customOptions.status) === -1 && call.customOptions.status !== "COMPLETED") {
                        me.Monitoring.objectManager.objects.add(call);
                    }
                }
            });
            stationFilter.items.each(function (checkbox) {
                if (checkbox.checked === true) {
                    j++
                }
            });
            if (stationFilter.items.length === j) {
                me.lookupReference('allStation').setValue(true)
            }
        }
    },

    checkedProfileBrigade: function (checkbox) {
        var me = this,
            checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            profileBrigadeFilter = this.lookupReference('profileBrigadeFilter');
        if (checkboxChecked === false) {
            me.filterBrigadeArray.push(checkboxValue);
            var i = 0;
            profileBrigadeFilter.items.each(function (checkbox) {
                if (checkbox.checked === true) {
                    i++
                }
            });
            if (profileBrigadeFilter.items.length === i + 1) {
                me.lookupReference('allProfile').setValue(false)
            }
            me.Monitoring.brigadesMarkers.forEach(function (brigade) {
                if (checkboxValue === brigade.customOptions.profile) {
                    me.Monitoring.objectManager.objects.remove(brigade);
                }
            })
        }
        if (checkboxChecked === true) {
            var index = me.filterBrigadeArray.indexOf(checkboxValue),
                j = 0;
            me.filterBrigadeArray.splice(index, 1);
            me.Monitoring.brigadesMarkers.forEach(function (brigade) {
                if (checkboxValue === brigade.customOptions.profile) {
                    if (me.filterBrigadeArray.indexOf(brigade.customOptions.status) === -1 && me.filterBrigadeArray.indexOf(brigade.customOptions.station) === -1) {
                        me.Monitoring.objectManager.objects.add(brigade);
                    }
                }
            });
            profileBrigadeFilter.items.each(function (checkbox) {
                if (checkbox.checked === true) {
                    j++
                }
            });
            if (profileBrigadeFilter.items.length === j) {
                me.lookupReference('allProfile').setValue(true)
            }
        }
    },

    checkedStatusBrigade: function (checkbox) {
        var me = this,
            checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            statusBrigadeFilter = this.lookupReference('statusBrigadeFilter');
        if (checkboxChecked === false) {
            me.filterBrigadeArray.push(checkboxValue);
            var i = 0;
            statusBrigadeFilter.items.each(function (checkbox) {
                if (checkbox.checked === true) {
                    i++
                }
            });
            if (statusBrigadeFilter.items.length === i + 1) {
                me.lookupReference('allStatus').setValue(false)
            }
            me.Monitoring.brigadesMarkers.forEach(function (brigade) {
                if (checkboxValue === brigade.customOptions.status) {
                    me.Monitoring.objectManager.objects.remove(brigade);
                }
            })
        }
        if (checkboxChecked === true) {
            var index = me.filterBrigadeArray.indexOf(checkboxValue),
                j = 0;
            me.filterBrigadeArray.splice(index, 1);
            me.Monitoring.brigadesMarkers.forEach(function (brigade) {
                if (checkboxValue === brigade.customOptions.status) {
                    if (me.filterBrigadeArray.indexOf(brigade.customOptions.profile) === -1 && me.filterBrigadeArray.indexOf(brigade.customOptions.station) === -1) {
                        me.Monitoring.objectManager.objects.add(brigade);
                    }
                }
            });
            statusBrigadeFilter.items.each(function (checkbox) {
                if (checkbox.checked === true) {
                    j++
                }
            });
            if (statusBrigadeFilter.items.length === j) {
                me.lookupReference('allStatus').setValue(true)
            }
        }
    },

    mainBoxReady: function () {
        var me = this,
            property = me.getViewModel().getStore('Property');
        property.load(function (records) {
            records.forEach(function (data) {
                me.urlGeodata = data.get('urlGeodata');
                me.urlWebSocket = data.get('urlWebSocket');
            });
            ymaps.ready(function () {
                me.createMap();
            });
        });
    },

    connect: function () {
        var me = this,
            socket = new SockJS(me.urlWebSocket + '/geo');
        me.stompClient = Stomp.over(socket);
        me.stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            me.stompClient.subscribe('/geo-queue/geodata-updates', function (greeting) {
                console.dir(greeting);
                me.showGreeting(JSON.parse(greeting.body));
            });
        });
    },

    showGreeting: function (message) {
        var me = this;
        message.station = '' + message.station;
        if (me.Monitoring.station.indexOf(message.station) !== -1) {
            if (message.objectType === 'BRIGADE') {
                var storeBrigades = me.getViewModel().getStore('Brigades');
                storeBrigades.loadRawData(message);
                me.Monitoring.createMarkers();
            }
            if (message.objectType === 'CALL') {
                var storeCalls = me.getViewModel().getStore('Calls');
                storeCalls.loadRawData(message);
                me.Monitoring.createMarkers();
            }
        }
    },

    sendName: function () {
        //stompClient.send("/app/hello", {}, JSON.stringify({ 'name': name }));
    },
    disconnect: function () {
        stompClient.disconnect();
        console.log("Disconnected");
    },

    createMap: function () {
        var me = this,
            bounds = [
                [60.007645, 30.092139],
                [59.923862, 30.519157]
            ];
        me.connect();
        me.Monitoring = Ext.create('Isidamaps.services.monitoringView.MapService', {
            viewModel: me.getViewModel(),
            markerClick: me.markerClick,
            clustersClick: me.clustersClick,
            boundsMap: bounds,
            filterBrigadeArray: me.filterBrigadeArray,
            filterCallArray: me.filterCallArray,
            urlGeodata: me.urlGeodata,
            getStoreMarkerInfo: me.getStoreMarkerInfo
        });
        me.Monitoring.optionsObjectManager();
        ASOV.setMapManager({
            setStation: me.Monitoring.setStation.bind(this)
        }, Ext.History.currentToken);
        var ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.Monitoring.resizeMap();
        });
    },

    addStationFilter: function () {
        var me = this,
            checkboxStation = me.lookupReference('stationFilter'),
            records = me.Monitoring.station;
        records.forEach(function (rec) {
            checkboxStation.add(Ext.create('Ext.form.field.Checkbox', {
                boxLabel: rec,
                inputValue: rec,
                checked: true,
                listeners: {
                    change: {
                        fn: function (checkbox, checked) {
                            Ext.fireEvent('checkedStationBrigade', checkbox, checked);
                        }
                    }
                }
            }));
        })
    },

    addButtonsBrigadeOnPanel: function () {
        var me = this,
            buttonBrigade = me.lookupReference('BrigadePanel'),
            brigadeSort = me.Monitoring.brigadesMarkers;
        buttonBrigade.removeAll();
        brigadeSort.sort(function (a, b) {
            return a.customOptions.brigadeNum - b.customOptions.brigadeNum
        });
        brigadeSort.forEach(function (e) {
            buttonBrigade.add(Ext.create('Ext.Button', {
                text: e.customOptions.brigadeNum,
                minWidth: 70,
                margin: 5,
                listeners: {
                    click: function (r) {
                        var infoMarker = me.getStoreMarkerInfo(e);
                        me.markerClick(e, [r.getXY()[0] + 80, r.getXY()[1] + 30], infoMarker);
                    }
                }
            }))
        })
    },
    getStoreMarkerInfo: function (object) {
        var me = this,
            urlInfoMarker = Ext.String.format(me.urlGeodata + '/info?objectid={0}&objecttype={1}', object.id, object.customOptions.objectType);
        if (object.customOptions.objectType === 'BRIGADE') {
            return Ext.create('Ext.data.Store', {
                model: 'Isidamaps.model.InfoBrigade',
                proxy: {
                    type: 'ajax',
                    url: urlInfoMarker,
                    reader: {
                        type: 'json',
                        rootProperty: 'additionalInfo.brigade'
                    }
                },
                autoLoad: false
            });
        }
        if (object.customOptions.objectType === 'CALL') {
            return Ext.create('Ext.data.Store', {
                model: 'Isidamaps.model.InfoCall',
                proxy: {
                    type: 'ajax',
                    url: urlInfoMarker,
                    reader: {
                        type: 'json',
                        rootProperty: 'additionalInfo.call'
                    }
                },
                autoLoad: false
            });
        }
        if (object.customOptions.objectType === 'MEDORG') {
            return Ext.create('Ext.data.Store', {
                model: 'Isidamaps.model.InfoMedorgs',
                proxy: {
                    type: 'ajax',
                    url: urlInfoMarker,
                    reader: {
                        type: 'json',
                        rootProperty: 'additionalInfo.megOrg'
                    }
                },
                autoLoad: false
            });
        }
    },

    layoutReady: function () {
        this.fireTabEvent(this.lookupReference('navigationPanel'));
    },

    tabChange: function (panel, newTab, oldTab) {
        oldTab.fireEvent('tabExit');
        this.fireTabEvent(newTab);
    },

    fireTabEvent: function (tab) {
        tab.fireEvent('tabEnter');
    },

    clustersClick: function (coords, cluster) {
        function errorMessage(marker) {
            var markerMessage = null;
            if (marker === 'CALL') {
                markerMessage = 'Данные о вызове временно не доступны';
            }
            if (marker === 'BRIGADE') {
                markerMessage = 'Данные о бригаде временно не доступны';
            }
            Ext.create('Ext.window.MessageBox').show({
                title: 'Ошибка',
                message: markerMessage,
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            })
        }

        var me = this,
            ymapWrapper = Ext.getCmp('mapId'),
            sizeCmp = ymapWrapper.getSize(),
            win = Ext.WindowManager.getActive();
        if (win) {
            win.close();
        }
        sizeCmp.width = sizeCmp.width * 1.25;
        if ((sizeCmp.width / 2) < coords[0]) {
            coords[0] -= 600;
            coords[1] += 20;
        }
        if ((sizeCmp.height / 2) < coords[1]) {
            coords[1] -= 550;
        }
        Ext.create('Ext.window.Window', {
            title: 'Кластер',
            layout: 'hbox',
            resizable: false,
            border: 'fit',
            width: 750,
            height: 480,
            scrollable: 'vertical',

            items: [{
                xtype: 'panel',
                id: 'markerInClustersId',
                autoScroll: true,
                layout: 'vbox',
                height: '100%',
                width: '21%'
            },
                {
                    xtype: 'panel',
                    id: 'infoMarkerId',
                    autoScroll: true,
                    height: '100%',
                    width: '79%'
                }
            ]
        }).showAt(coords);
        var markerInClusters = Ext.getCmp('markerInClustersId');
        markerInClusters.removeAll();
        var infoMarker = Ext.getCmp('infoMarkerId');
        cluster.features.forEach(function (marker) {
            if (marker.customOptions.objectType === 'CALL') {
                markerInClusters.add(Ext.create('Ext.Button', {
                    text: 'Вызов№ ' + marker.customOptions.callCardNum,
                    maxWidth: 140,
                    minWidth: 140,
                    margin: 5,
                    listeners: {
                        click: function () {
                            var storeMarker = me.getStoreMarkerInfo(marker);
                            infoMarker.removeAll();
                            storeMarker.load({
                                callback: function (records, operation, success) {
                                    if (success === true) {
                                        if (records.length === 0) {
                                            errorMessage('CALL');
                                        }
                                    }
                                    if (success === false) {
                                        try {
                                            errorMessage('CALL');
                                        } catch (e) {
                                            errorMessage('CALL');
                                        }
                                    }
                                    if (success === true) {
                                        if (records.length > 0) {
                                            infoMarker.add(Ext.create('Ext.Panel', {
                                                layout: 'form',
                                                border: 'fit',
                                                autoScroll: true,
                                                resizable: false,
                                                width: '100%',
                                                items: me.callInfoForm,
                                                listeners: {
                                                    afterrender: function (component) {
                                                        var form = component.down('form');
                                                        form.loadRecord(storeMarker.first());
                                                    }
                                                }
                                            }))
                                        }
                                    }
                                }
                            })
                        }
                    }
                }))
            }

            if (marker.customOptions.objectType === 'BRIGADE') {
                markerInClusters.add(Ext.create('Ext.Button', {
                    text: 'Бригада № ' + marker.customOptions.brigadeNum,
                    maxWidth: 140,
                    minWidth: 140,
                    margin: 5,
                    listeners: {
                        click: function () {
                            var storeMarker = me.getStoreMarkerInfo(marker);
                            infoMarker.removeAll();
                            storeMarker.load({
                                callback: function (records, operation, success) {
                                    if (success === true) {
                                        if (records.length === 0) {
                                            errorMessage('BRIGADE');
                                        }
                                    }
                                    if (success === false) {
                                        try {
                                            errorMessage('BRIGADE');
                                        } catch (e) {
                                            errorMessage('BRIGADE');
                                        }
                                    }
                                    if (success === true) {
                                        if (records.length > 0) {
                                            var status = null;
                                            records.forEach(function (brigade) {
                                                switch (brigade.get('status')) {
                                                    case 'FREE':
                                                        status = 'Свободна';
                                                        break;
                                                    case 'ON_EVENT':
                                                        status = 'Дежурство на мероприятии';
                                                        break;
                                                    case 'WITHOUT_SHIFT':
                                                        status = 'Вне графика';
                                                        break;
                                                    case 'CRASH_CAR':
                                                        status = 'Ремонт';
                                                        break;
                                                    case 'PASSED_BRIGADE':
                                                        status = 'Принял вызов';
                                                        break;
                                                    case 'AT_CALL':
                                                        status = 'На вызове';
                                                        break;
                                                    case 'RELAXON':
                                                        status = 'Обед';
                                                        break;
                                                    case 'GO_HOSPITAL':
                                                        status = 'Транспортировка в стационар';
                                                        break;
                                                    case 'HIJACKING':
                                                        status = 'Нападение на бригаду';
                                                        break;
                                                    default:
                                                        status = 'Неизвестно';
                                                        break;
                                                }
                                            });
                                            infoMarker.add(Ext.create('Ext.Panel', {
                                                layout: 'form',
                                                border: 'fit',
                                                autoScroll: true,
                                                resizable: false,
                                                width: '100%',
                                                items: [{
                                                    xtype: 'form',
                                                    autoScroll: true,
                                                    height: '100%',
                                                    width: '100%',
                                                    items: [{
                                                        xtype: 'displayfield',
                                                        name: 'brigadeNum',
                                                        fieldLabel: 'Номер бригады',
                                                        labelWidth: '100%',
                                                        margin: 0
                                                    },
                                                        {
                                                            xtype: 'displayfield',
                                                            name: 'station',
                                                            fieldLabel: 'Номер подстанции',
                                                            labelWidth: '100%',
                                                            margin: 0
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            value: marker.customOptions.profile,
                                                            fieldLabel: 'Профиль бригады',
                                                            labelWidth: '100%',
                                                            margin: 0
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            value: status,
                                                            fieldLabel: 'Статус бригады',
                                                            labelWidth: '100%',
                                                            margin: 0
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            fieldLabel: 'Старший бригады',
                                                            name: 'chefName',
                                                            labelWidth: '100%',
                                                            margin: 0
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            name: 'callCardNum',
                                                            fieldLabel: 'Вызов',
                                                            labelWidth: '100%',
                                                            margin: 0
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            name: 'address',
                                                            fieldLabel: 'Адрес места вызова',
                                                            labelWidth: 150,
                                                            margin: 0
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            name: 'passToBrigadeTime',
                                                            fieldLabel: 'Время получения бригадой',
                                                            renderer: Ext.util.Format.dateRenderer('Y-m-d, h:i:s'),
                                                            labelWidth: '100%',
                                                            margin: 0
                                                        }
                                                    ]
                                                }],
                                                listeners: {
                                                    afterrender: function (component) {
                                                        var form = component.down('form');
                                                        form.loadRecord(storeMarker.first());
                                                    }
                                                }
                                            }))
                                        }
                                    }
                                }
                            })
                        }
                    }
                }))
            }
        })
    },

    markerClick: function (object, coords, infoMarker) {
        var me = this;
        function errorMessage(marker) {
            var markerMessage = null;
            if (marker === 'CALL') {
                markerMessage = 'Данные о вызове временно не доступны';
            }
            if (marker === 'BRIGADE') {
                markerMessage = 'Данные о бригаде временно не доступны';
            }
            Ext.create('Ext.window.MessageBox').show({
                title: 'Ошибка',
                message: markerMessage,
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            })
        }

        var ymapWrapper = Ext.getCmp('mapId'),
            sizeCmp = ymapWrapper.getSize(),
            win = Ext.WindowManager.getActive();
        if (win) {
            win.close();
        }

        sizeCmp.width = sizeCmp.width * 1.55;
        if (object.customOptions.objectType === 'BRIGADE') {
            if ((sizeCmp.width / 2) < coords[0]) {
                coords[0] -= 500;
                coords[1] += 20;
            }
            if ((sizeCmp.height / 2) < coords[1]) {
                coords[1] -= 270;
            }
            infoMarker.load({
                callback: function (records, operation, success) {
                    if (success === true) {
                        if (records.length === 0) {
                            errorMessage('BRIGADE');
                        }
                    }
                    if (success === false) {
                        try {
                            errorMessage('BRIGADE');
                        } catch (e) {
                            errorMessage('BRIGADE');
                        }
                    }
                    if (success === true) {
                        if (records.length > 0) {
                            var status = null;
                            records.forEach(function (brigade) {
                                switch (brigade.get('status')) {
                                    case 'FREE':
                                        status = 'Свободна';
                                        break;
                                    case 'ON_EVENT':
                                        status = 'Дежурство на мероприятии';
                                        break;
                                    case 'WITHOUT_SHIFT':
                                        status = 'Вне графика';
                                        break;
                                    case 'CRASH_CAR':
                                        status = 'Ремонт';
                                        break;
                                    case 'PASSED_BRIGADE':
                                        status = 'Принял вызов';
                                        break;
                                    case 'AT_CALL':
                                        status = 'На вызове';
                                        break;
                                    case 'RELAXON':
                                        status = 'Обед';
                                        break;
                                    case 'GO_HOSPITAL':
                                        status = 'Транспортировка в стационар';
                                        break;
                                    case 'HIJACKING':
                                        status = 'Нападение на бригаду';
                                        break;
                                    default:
                                        status = 'Неизвестно';
                                        break;
                                }
                            });
                            Ext.create('Ext.window.Window', {
                                title: 'Бригада',
                                layout: 'form',
                                border: 'fit',
                                autoScroll: true,
                                resizable: false,
                                width: 500,
                                //height: 250,
                                items: [{
                                    xtype: 'form',
                                    autoScroll: true,
                                    height: '100%',
                                    width: '100%',
                                    items: [{
                                        xtype: 'displayfield',
                                        name: 'brigadeNum',
                                        fieldLabel: 'Номер бригады',
                                        labelWidth: '100%',
                                        margin: 0
                                    },
                                        {
                                            xtype: 'displayfield',
                                            name: 'station',
                                            fieldLabel: 'Номер подстанции',
                                            labelWidth: '100%',
                                            margin: 0
                                        },
                                        {
                                            xtype: 'displayfield',
                                            value: object.customOptions.profile,
                                            fieldLabel: 'Профиль бригады',
                                            labelWidth: '100%',
                                            margin: 0
                                        },
                                        {
                                            xtype: 'displayfield',
                                            value: status,
                                            fieldLabel: 'Статус бригады',
                                            labelWidth: '100%',
                                            margin: 0
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Старший бригады',
                                            name: 'chefName',
                                            labelWidth: '100%',
                                            margin: 0
                                        },
                                        {
                                            xtype: 'displayfield',
                                            name: 'callCardNum',
                                            fieldLabel: 'Вызов',
                                            labelWidth: '100%',
                                            margin: 0
                                        },
                                        {
                                            xtype: 'displayfield',
                                            name: 'address',
                                            fieldLabel: 'Адрес места вызова',
                                            labelWidth: 150,
                                            margin: 0
                                        },
                                        {
                                            xtype: 'displayfield',
                                            name: 'passToBrigadeTime',
                                            fieldLabel: 'Время получения бригадой',
                                            renderer: Ext.util.Format.dateRenderer('Y-m-d, h:i:s'),
                                            labelWidth: '100%',
                                            margin: 0
                                        }
                                    ]
                                }],
                                listeners: {
                                    afterrender: function (component) {
                                        var form = component.down('form');
                                        form.loadRecord(infoMarker.first());
                                    }
                                }
                            }).showAt(coords);
                        }
                    }
                }
            })
        }
        if (object.customOptions.objectType === 'CALL') {
            if ((sizeCmp.width / 2) < coords[0]) {
                coords[0] -= 600;
                coords[1] += 20;
            }
            if ((sizeCmp.height / 2) < coords[1]) {
                coords[0] += 20;
                coords[1] -= 470;
            }
            infoMarker.load({
                callback: function (records, operation, success) {
                    if (success === true) {
                        if (records.length === 0) {
                            errorMessage('CALL');
                        }
                    }
                    if (success === false) {
                        try {
                            errorMessage('CALL');
                        } catch (e) {
                            errorMessage('CALL');
                        }
                    }
                    if (success === true) {
                        if (records.length > 0) {
                            Ext.create('Ext.window.Window', {
                                title: 'Вызов',
                                layout: 'form',
                                id: 'winId',
                                border: 'fit',
                                autoScroll: true,
                                resizable: false,
                                width: 550,
                                items: me.callInfoForm,
                                listeners: {
                                    afterrender: function (component) {
                                        var form = component.down('form');
                                        form.loadRecord(infoMarker.first());
                                    }
                                }
                            }).showAt(coords);
                        }
                    }
                }
            })
        }
    }
});
