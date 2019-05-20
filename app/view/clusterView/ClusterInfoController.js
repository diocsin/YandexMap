Ext.define('Isidamaps.view.clusterView.ClusterInfoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.clusterInfoController',
    callStatusesMap: (function () {
        const map = Ext.create('Ext.util.HashMap');
        map.add('NEW', 'Новый');
        map.add('COMPLETED', 'Завершен');
        map.add('ASSIGNED', 'Исполнение');
        return map;
    })(),

    clustersClick: function (cluster) {
        const win = Ext.WindowManager.getActive();
        if (win) {
            win.close();
        }

        const clusterInfo = Ext.widget('clusterInfo');
        clusterInfo.show();
        const buttonsHolder = clusterInfo.lookup('buttonsHolder'),
            infoHolder = clusterInfo.lookup('infoHolder');
        cluster.getProperties().features.forEach((marker) => {
            const params = {
                objecttype: marker.getProperties().customOptions.objectType,
                objectid: marker.getProperties().id
            };
            if (marker.getProperties().customOptions.objectType === 'CALL') {
                buttonsHolder.add(Ext.create('Ext.Button', {
                    text: `Выз.№ ${marker.getProperties().customOptions.callCardNum} ${this.callStatusesMap.get(marker.getProperties().customOptions.status || 'Неизвестно')}`,
                    maxWidth: 170,
                    minWidth: 170,
                    margin: 5,
                    listeners: {
                        click: () => {
                            const storeMarker = Isidamaps.app.getController('AppController').getStoreMarkerInfo(marker);
                            infoHolder.removeAll();
                            storeMarker.load({
                                params: params,
                                callback: (records, operation, success) => {
                                    if ((success === true && records.length === 0) || success === false) {
                                        Isidamaps.util.Util.errorMessage('Внимание', 'Данные о вызове временно недоступны');
                                        return;
                                    }
                                    const callInfoForm = Ext.widget('callInfoForm'),
                                        callInfoViewModel = callInfoForm.getViewModel();
                                    callInfoViewModel.set('record', records[0]);
                                    infoHolder.add(callInfoForm);
                                }
                            })
                        }
                    }
                }))
            }
            if (marker.getProperties().customOptions.objectType === 'BRIGADE') {
                buttonsHolder.add(Ext.create('Ext.Button', {
                    text: `Бр.№ ${marker.getProperties().customOptions.brigadeNum} (${marker.getProperties().customOptions.profile}) ${marker.getProperties().customOptions.station}`,
                    maxWidth: 170,
                    minWidth: 170,
                    margin: 5,
                    listeners: {
                        click: () => {
                            const storeMarker = Isidamaps.app.getController('AppController').getStoreMarkerInfo(marker);
                            infoHolder.removeAll();
                            storeMarker.load({
                                params: params,
                                callback: (records, operation, success) => {
                                    if ((success === true && records.length === 0) || success === false) {
                                        Isidamaps.util.Util.errorMessage('Внимание', 'Данные о бригаде временно недоступны');
                                        return;
                                    }
                                    const record = records[0];
                                    record.set({
                                        'status': Isidamaps.app.getController('AppController').getBrigadeStatuses(records[0].get('status')),
                                        'profile': marker.getProperties().customOptions.profile
                                    });
                                    const brigadeInfoForm = Ext.widget('brigadeInfoForm'),
                                        brigadeInfoViewModel = brigadeInfoForm.getViewModel();
                                    brigadeInfoViewModel.set('record', record);
                                    infoHolder.add(brigadeInfoForm);
                                }
                            })
                        }
                    }
                }))
            }
        })
    }
});