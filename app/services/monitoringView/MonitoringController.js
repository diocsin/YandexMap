Ext.define('Isidamaps.services.monitoringView.MonitoringController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monitoring',
    Monitoring: null,
    filterBrigadeArray: [],
    filterCallArray: [],
    stompClient: null,
    urlGeodata: null,
    urlWebSocket: null,
    stateStatusBrigades: null,
    stateStation: null,
    stateProfileBrigades: null,
    stateStatusCalls: null,
    buttonBrigade: null,
    myMask: null,
    listen: {
        global: {
            checkedProfileBrigade: 'checkedProfileBrigade',
            checkedStatusBrigade: 'checkedStatusBrigade',
            checkedCallStatus: 'checkedCallStatus',
            checkedStationBrigade: 'checkedStationBrigade',
            setStateStatusBrigades: 'setStateStatusBrigades',
            setStateStation: 'setStateStation',
            setStateProfileBrigades: 'setStateProfileBrigades',
            setStateStatusCalls: 'setStateStatusCalls',
            addButtonsBrigadeOnPanel: 'addButtonsBrigadeOnPanel',
            addStationFilter: 'addStationFilter',
            getButtonBrigadeForChangeButton: 'getButtonBrigadeForChangeButton',
            buttonSearch: 'buttonSearch',
            deletingAllMarkers: 'deletingAllMarkers'
        }
    },

    setStateStatusBrigades: function (state) {
        const me = this;
        me.stateStatusBrigades = state;
    },

    setStateStation: function (state) {
        const me = this;
        me.stateStation = state;
    },

    setStateProfileBrigades: function (state) {
        const me = this;
        me.stateProfileBrigades = state;
    },

    setStateStatusCalls: function (state) {
        const me = this;
        me.stateStatusCalls = state;
    },

    deletingAllMarkers: function () {
        var me = this;
        me.Monitoring.objectManager.objects.removeAll();
    },

    buttonSearch: function () {
        var me = this;
        var searchTrue = null;
        var searchText = Ext.getCmp('searchTextField').getValue();
        me.Monitoring.objectManager.objects.getAll().forEach(function (object) {
            if (object.customOptions.brigadeNum === searchText) {
                me.Monitoring.map.setCenter([object.geometry.coordinates[0], object.geometry.coordinates[1]], 14);
                searchTrue = object;
                return;
            }
        });

        if (searchTrue === null) {
            Ext.getCmp('searchTextField').setActiveError('Не найдена бригада с данным номером');
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
        const me = this;
        var checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            stationFilter = me.lookupReference('stationFilter');
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
                    me.hideButtonInPanel(brigade);

                }
            });
            me.Monitoring.callMarkers.forEach(function (call) {
                if (checkboxValue === call.customOptions.station) {
                    me.Monitoring.objectManager.objects.remove(call);
                }
            });
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
                        me.showButtonInPanel(brigade);
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
        const me = this;
        var checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            profileBrigadeFilter = me.lookupReference('profileBrigadeFilter');
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
                    me.hideButtonInPanel(brigade);
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
                        me.showButtonInPanel(brigade);
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
        const me = this;
        var checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            statusBrigadeFilter = me.lookupReference('statusBrigadeFilter');
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
                    me.hideButtonInPanel(brigade);
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
                        me.showButtonInPanel(brigade);
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
                    me.showGreeting(JSON.parse(greeting.body));
                });
            }.bind(this),
            function (e) {
                console.error(e, "Reconnecting WS");
                window.setTimeout(function () {
                    this.connect();
                }.bind(this), 2500);
            }.bind(this)
        );
    },

    showGreeting: function (message) {
        var me = this;
        message.station = '' + message.station;
        if (me.Monitoring.station.indexOf(message.station) !== -1) {
            if (message.objectType === 'BRIGADE') {
                var storeBrigades = me.getViewModel().getStore('Brigades');
                storeBrigades.add(message);
            }
            if (message.objectType === 'CALL') {
                var storeCalls = me.getViewModel().getStore('Calls');
                storeCalls.add(message);
            }
        }
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
        me.myMask = new Ext.LoadMask({
            msg: 'Подождите пожалуйста. Загрузка...',
            target: Ext.getCmp('monitoringPanel')
        });
        me.myMask.show();
        me.Monitoring = Ext.create('Isidamaps.services.monitoringView.MapService', {
            viewModel: me.getViewModel(),
            markerClick: me.markerClick,
            clustersClick: me.clustersClick,
            boundsMap: bounds,
            filterBrigadeArray: me.filterBrigadeArray,
            filterCallArray: me.filterCallArray,
            urlGeodata: me.urlGeodata,
            getStoreMarkerInfo: me.getStoreMarkerInfo,
            getButtonBrigadeForChangeButton: me.getButtonBrigadeForChangeButton,
            setCheckbox: me.setCheckbox.bind(me),
            addNewButtonOnPanel: me.addNewButtonOnPanel.bind(me),
            destroyButtonOnPanel: me.destroyButtonOnPanel.bind(me),
        });
        me.Monitoring.optionsObjectManager();
        ASOV.setMapManager({
            setStation: me.Monitoring.setStation.bind(this)
        }, Ext.History.currentToken);
        me.setFilterBrigadeAndCall();
        me.connect();
        var ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.Monitoring.resizeMap();
        });


    },

    setFilterBrigadeAndCall: function () {
        const me = this;
        me.lookupReference('profileBrigadeFilter').eachBox(function (item) {
            me.filterBrigadeArray.push(item.inputValue);
        });
        me.lookupReference('statusBrigadeFilter').eachBox(function (item) {
            me.filterBrigadeArray.push(item.inputValue);
        });
        me.Monitoring.station.forEach(function (item) {
            me.filterBrigadeArray.push(item);
            me.filterCallArray.push(item);
        });
        me.lookupReference('callStatusFilter').eachBox(function (item) {
            me.filterCallArray.push(item.inputValue);
        });
    },

    setCheckbox: function () {
        const me = this;
        try {
            me.lookupReference('stationFilter').setValue(me.stateStation.checked);
            me.lookupReference('profileBrigadeFilter').setValue(me.stateProfileBrigades.checked);
            me.lookupReference('statusBrigadeFilter').setValue(me.stateStatusBrigades.checked);
            me.lookupReference('callStatusFilter').setValue(me.stateStatusCalls.checked);
        }
        catch (e) {
        }
        me.myMask.hide();
    },

    addStationFilter: function () {
        var me = this,
            checkboxStation = me.lookupReference('stationFilter'),
            buttonBrigade = me.lookupReference('BrigadePanel'),
            records = me.Monitoring.station;
        records.forEach(function (rec) {
            checkboxStation.add(Ext.create('Ext.form.field.Checkbox', {
                boxLabel: rec,
                inputValue: rec,
                checked: false,
                listeners: {
                    change: {
                        fn: function (checkbox, checked) {
                            Ext.fireEvent('checkedStationBrigade', checkbox, checked);
                        }
                    }
                }
            }));
            buttonBrigade.add(Ext.create('Ext.panel.Panel', {
                itemId: 'panel_' + rec,
                title: rec,
                width: 260,
                renderTo: Ext.getBody(),
                floatable: true,
                collapsible: true,
                scrollable: 'vertical',
                collapseToolText: 'Скрыть панель',
                expandToolText: 'Открыть панель',
                header: {
                    titlePosition: 1
                }
            }));
        });

    },

    getButtonBrigadeForChangeButton: function (brigade, oldStatus) {
        var me = this;
        var brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
        var brigadeHave = brigadePanel.getComponent('id' + brigade.id);
        brigadeHave.removeCls('button_' + oldStatus);
        brigadeHave.addCls('button_' + brigade.customOptions.status);
        brigadePanel.updateLayout();
    },

    hideButtonInPanel: function (brigade) {
        var me = this;
        var brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
        brigadePanel.getComponent('id' + brigade.id).hide();

    },

    destroyButtonOnPanel: function (brigade) {
        const me = this;
        try {
            var brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
            brigadePanel.getComponent('id' + brigade.id).destroy();
        }
        catch (e) {

        }

    },

    addNewButtonOnPanel: function (brigade) {
        const me = this;
        var brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
        var button = me.createButton(brigade);
        brigadePanel.add(button);
        button.show();
    },

    showButtonInPanel: function (brigade) {
        var me = this;
        var brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
        brigadePanel.getComponent('id' + brigade.id).show();
    },

    addButtonsBrigadeOnPanel: function () {
        var me = this,
            brigadeSort = [];
        me.buttonBrigade = me.lookupReference('BrigadePanel');
        me.Monitoring.brigadesMarkers.forEach(function (brigade) {
            if (brigade.customOptions.status !== 'WITHOUT_SHIFT') {
                brigadeSort.push(brigade);
            }
        });
        brigadeSort.sort(function (a, b) {
            return a.customOptions.station - b.customOptions.station
        });
        brigadeSort.sort(function (a, b) {
            return a.customOptions.status === b.customOptions.status ? -1 : 1
        });
        brigadeSort.forEach(function (e) {
            var button = me.createButton(e);
            var t = me.buttonBrigade.getComponent('panel_' + e.customOptions.station);
            t.add(button);
        });
    },

    createButton: function (e) {
        const me = this;
        return Ext.create('Ext.Button', {
            itemId: 'id' + e.id,
            text: e.customOptions.brigadeNum + " " + "(" + e.customOptions.profile + ")",
            maxWidth: 110,
            minWidth: 110,
            margin: 5,
            hidden: true,
            hideMode: 'offsets',
            cls: 'button_' + e.customOptions.status,
            listeners: {
                click: function (r) {
                    me.clickButton(e);
                }
            }
        });
    },

    clickButton: function (object) {
        var me = this;
        var t = me.Monitoring.objectManager.objects.getById(object.id);
        if (t !== null) {
            me.Monitoring.map.setCenter([t.geometry.coordinates[0], t.geometry.coordinates[1]], 14);
        }
    }
    ,

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
    }
    ,

    layoutReady: function () {
        this.fireTabEvent(this.lookupReference('navigationPanel'));
    }
    ,

    tabChange: function (panel, newTab, oldTab) {
        oldTab.fireEvent('tabExit');
        this.fireTabEvent(newTab);
    }
    ,

    fireTabEvent: function (tab) {
        tab.fireEvent('tabEnter');
    }
    ,

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
            constrain: true,
            border: 'fit',
            width: 750,
            height: 480,
            scrollable: 'vertical',

            items: [{
                xtype: 'panel',
                id: 'markerInClustersId',
                scrollable: 'vertical',
                autoScroll: true,
                layout: 'vbox',
                height: '100%',
                width: '27%'
            },
                {
                    xtype: 'panel',
                    id: 'infoMarkerId',
                    height: '100%',
                    width: '73%'
                }
            ]
        }).showAt(coords);
        var markerInClusters = Ext.getCmp('markerInClustersId');
        markerInClusters.removeAll();
        var infoMarker = Ext.getCmp('infoMarkerId');

        cluster.features.forEach(function (marker) {
            function f() {
                if (marker.customOptions.status === 'NEW') {
                    return 'Новый'
                }
                if (marker.customOptions.status === 'COMPLETED') {
                    return 'Завершен'
                }
                if (marker.customOptions.status === 'ASSIGNED') {
                    return 'Исполнение'
                }
                return ""
            }

            if (marker.customOptions.objectType === 'CALL') {
                markerInClusters.add(Ext.create('Ext.Button', {
                    text: 'Выз.№ ' + marker.customOptions.callCardNum + " " + f(),
                    maxWidth: 170,
                    minWidth: 170,
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
                    text: 'Бр.№ ' + marker.customOptions.brigadeNum + " " + "(" + marker.customOptions.profile + ")" + " " + marker.customOptions.station,
                    maxWidth: 170,
                    minWidth: 170,
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
                                                width: '100%',
                                                items: [{
                                                    xtype: 'form',
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
                                                            renderer: Ext.util.Format.dateRenderer('Y-m-d, H:i:s'),
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
    }
    ,

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
                                constrain: true,
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
                                            renderer: Ext.util.Format.dateRenderer('Y-m-d, H:i:s'),
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
                                constrain: true,
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
})
;
