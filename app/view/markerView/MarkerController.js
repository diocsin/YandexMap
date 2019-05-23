Ext.define('Isidamaps.view.markerView.MarkerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.markercontroller',
    MyIconContentLayout: null,
    call: null,
    brigade: null,
    listen: {
        global: {
            activateTab: 'activateTab'
        }
    },

    markerClick: function (object, objects) {
        const win = Ext.WindowManager.getActive(),
            {id, customOptions: {objectType}} = object;
        if (win) {
            win.close();
        }
        const storeMarker = Isidamaps.app.getController('AppController').getStoreAboutMarker(object),
            params = {
                objecttype: objectType,
                objectid: id
            };
        const options = {
            params: params,
            store: storeMarker
        };
        this.call = null;
        this.brigade = null;
        if (objectType === 'BRIGADE') {
            this.brigadeMarkerClick(options, object, objects);
            return;
        }
        this.callMarkerClick(options, object, objects);
    }
    ,

    brigadeMarkerClick: function (options, object, objects) {
        Ext.getCmp('mapId').mask('Запрос данных, пожалуйста подождите...');
        options.store.load({
            params: options.params,
            callback: (records, operation, success) => {
                if ((success === true && records.length === 0) || success === false) {
                    Ext.getCmp('mapId').unmask();
                    Isidamaps.util.Util.errorMessage('Внимание', 'Данные о бригаде временно не доступны');
                    return;
                }
                Ext.getCmp('mapId').unmask();
                const record = records[0],
                    status = Isidamaps.app.getController('AppController').getBrigadeStatuses(record.get('status'));
                record.set({
                    'status': status,
                    'profile': object.customOptions.profile
                });
                const brigadeInfoWidget = Ext.widget('brigadeInfo'),
                    brigadeInfoViewModel = brigadeInfoWidget.getViewModel();
                brigadeInfoViewModel.set('record', record);
                brigadeInfoWidget.show()/*At(coord)*/;
                if (object.customOptions.status === 'AT_CALL' || object.customOptions.status === 'PASSED_BRIGADE') {
                    objects.each(call => {
                        if (call.customOptions.objectType === 'CALL' && call.customOptions.callCardNum === record.get('callCardNum')) {
                            this.call = call;
                            this.brigade = object;
                        }
                        else {
                            Ext.getCmp('tabPanelBrigade').getComponent(1).setHtml('Вызов не найден');
                        }
                    });
                }
                else {
                    Ext.getCmp('tabPanelBrigade').getComponent(1).tab.hide();
                }
            }
        });


    },

    activateTab: function (me, panelId) {
        if (this.call || this.brigade) {
            me.update();
            const bound = [
                [60.007645, 30.092139],
                [59.923862, 30.519157]];
            const map = new ymaps.Map(panelId, {
                bounds: bound,
                controls: []
            });
            map.behaviors.disable('dblClickZoom').enable(['rightMouseButtonMagnifier']);
            const objectManager = new ymaps.ObjectManager({
                clusterize: false, //true
                clusterDisableClickZoom: true,
                clusterOpenBalloonOnClick: false
            });
            objectManager.objects.options.set({
                iconLayout: 'default#image',
                zIndex: 2000,
                iconImageSize: [40, 40]

            });
            this.MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="color: #000000;  border: 1px solid; display: inline-block; background-color: #faf8ff; text-align: center; border-radius: 6px; z-index: 2;font-size: 12pt">$[properties.iconContent]</div>'
            );
            objectManager.add(this.brigade);
            objectManager.add(this.call);
            map.geoObjects.add(objectManager);
            this.createMapBounds(map, this.call, this.brigade);
        }
    },

    createMapBounds: function (map, call, brigade) {
        const arrayLatitude = [],
            arrayLongitude = [];
        arrayLatitude.push(call.geometry.coordinates[0]);
        arrayLongitude.push(call.geometry.coordinates[1]);
        arrayLatitude.push(brigade.geometry.coordinates[0]);
        arrayLongitude.push(brigade.geometry.coordinates[1]);
        arrayLatitude.sort(function (a, b) {
            return a - b
        });
        arrayLongitude.sort(function (a, b) {
            return a - b
        });
        let bounds = [
            [arrayLatitude[arrayLatitude.length - 1], arrayLongitude[0]],
            [arrayLatitude[0], arrayLongitude[arrayLatitude.length - 1]]
        ];
        map.setBounds(bounds, {checkZoomRange: true}).then(() => {
            if (map.getZoom() > 23) map.setZoom(22)
        });
    },

    callMarkerClick: function (options, object, objects) {
        Ext.getCmp('mapId').mask('Запрос данных, пожалуйста подождите...');
        options.store.load({
            params: options.params,
            callback: (records, operation, success) => {
                if ((success === true && records.length === 0) || success === false) {
                    Ext.getCmp('mapId').unmask();
                    Isidamaps.util.Util.errorMessage('Внимание', 'Данные о вызове временно недоступны');
                    return;
                }
                Ext.getCmp('mapId').unmask();
                const callInfoWidget = Ext.widget('callInfo'),
                    callInfoViewModel = callInfoWidget.getViewModel();
                callInfoViewModel.set('record', records[0]);
                callInfoWidget.show()/*At(coord)*/;
                if (object.customOptions.status === 'ASSIGNED') {
                    objects.each(brigade => {
                        if (brigade.customOptions.objectType === 'BRIGADE' && brigade.customOptions.brigadeNum === records[0].get('brigadeNum')) {
                            this.brigade = brigade;
                            this.call = object;
                        }
                        else {
                            Ext.getCmp('tabPanelCall').getComponent(1).setHtml('Бригада не найдена');
                        }
                    });
                }
                else {
                    Ext.getCmp('tabPanelCall').getComponent(1).tab.hide();
                }
            }
        })
    }
});