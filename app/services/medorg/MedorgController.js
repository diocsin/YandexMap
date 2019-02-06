Ext.define('Isidamaps.services.medorg.MedorgController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.medorg',

    createClass: function () {
        const me = this,
            Medorg = Ext.create('Isidamaps.services.medorg.MapService', {
                markerClick: me.markerClick
            });
        Medorg.optionsObjectManager();
        Medorg.listenerStore();
        Isidamaps.app.getController('AppController').initial(f);

        function f() {
            Isidamaps.app.getController('AppController').readMedOrg();
        }

        const ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            Medorg.resizeMap();
        });
    },

    layoutReady: function () {
    },

    tabChange: function (panel, newTab, oldTab) {
    },

    fireTabEvent: function (tab) {
    },

    /** clustersClick: function (coords, cluster) {
        function errorMessage() {
            Ext.create('Ext.window.MessageBox').show({
                title: 'Ошибка',
                message: 'Данные об организации временно не доступны',
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
        if ((sizeCmp.width / 2) < coords[0]) {
            coords[0] -= 600;
            coords[1] += 20;
        }
        if ((sizeCmp.height / 2) < coords[1]) {
            coords[1] -= 300;
        }
        Ext.create('Ext.window.Window', {
            title: 'Кластер',
            layout: 'hbox',
            border: 'fit',
            resizable: false,
            width: 821,
            height: 405,
            scrollable: 'vertical',
            items: [{
                xtype: 'panel',
                id: 'markerInClustersId',
                autoScroll: true,
                layout: 'vbox',
                height: '100%',
                width: '30%'
            },
                {
                    xtype: 'panel',
                    id: 'infoMarkerId',
                    autoScroll: true,
                    height: '100%',
                    width: '70%'
                }
            ]
        }).showAt(coords);
        var markerInClusters = Ext.getCmp('markerInClustersId'),
            infoMarker = Ext.getCmp('infoMarkerId');
        markerInClusters.removeAll();
        cluster.features.forEach(function (marker) {
            markerInClusters.add(Ext.create('Ext.Button', {
                text: marker.customOptions.organizationName,
                maxWidth: 200,
                minWidth: 200,
                margin: 5,
                listeners: {
                    click: function () {
                        var storeMarker = me.getStoreMarkerInfo(marker);
                        infoMarker.removeAll();
                        storeMarker.load({
                            callback: function (records, operation, success) {
                                if (success === true) {
                                    if (records.length === 0) {
                                        errorMessage();
                                    }
                                }
                                if (success === false) {
                                    try {
                                        errorMessage();
                                    } catch (e) {
                                        errorMessage();
                                    }
                                }
                                if (success === true) {
                                    if (records.length > 0) {
                                        infoMarker.add(Ext.create('Ext.Panel', {
                                            layout: 'form',
                                            border: 'fit',
                                            autoScroll: true,
                                            width: '100%',
                                            height: '100%',
                                            items: [{
                                                xtype: 'form',
                                                margin: 0,
                                                items: [{
                                                    xtype: 'displayfield',
                                                    name: 'name',
                                                    labelWidth: '100%',
                                                    margin: 0
                                                }]
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
        })
    },

     markerClick: function (object, coords, infoMarker) {
        function errorMessage() {
            Ext.create('Ext.window.MessageBox').show({
                title: 'Ошибка',
                message: 'Данные об организации временно не доступны',
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
        if ((sizeCmp.width / 2) < coords[0]) {
            coords[0] -= 450;
            coords[1] += 20;
        }
        if ((sizeCmp.height / 2) < coords[1]) {
            coords[1] -= 150;
        }
        infoMarker.load({
            callback: function (records, operation, success) {
                if (success === true) {
                    if (records.length === 0) {
                        errorMessage();
                    }
                }
                if (success === false) {
                    try {
                        errorMessage();
                    } catch (e) {
                        errorMessage();
                    }
                }
                if (success === true) {
                    if (records.length > 0) {
                        Ext.create('Ext.window.Window', {
                            title: 'Мед. учереждение',
                            layout: 'form',
                            border: 'fit',
                            resizable: false,
                            width: 400,
                            items: [{
                                xtype: 'form',
                                height: '100%',
                                width: '100%',
                                items: [{
                                    xtype: 'form',
                                    height: '100%',
                                    width: '100%',
                                    margin: 0,
                                    items: [{
                                        xtype: 'displayfield',
                                        name: 'name',
                                        labelWidth: '100%',
                                        margin: 0
                                    }]
                                }]
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
     clustersClick: function (coords, cluster) {
       function errorMessage() {
           Ext.create('Ext.window.MessageBox').show({
               title: 'Ошибка',
               message: 'Данные об организации временно не доступны',
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
       if ((sizeCmp.width / 2) < coords[0]) {
           coords[0] -= 600;
           coords[1] += 20;
       }
       if ((sizeCmp.height / 2) < coords[1]) {
           coords[1] -= 300;
       }
       Ext.create('Ext.window.Window', {
           title: 'Кластер',
           layout: 'hbox',
           border: 'fit',
           resizable: false,
           width: 821,
           height: 405,
           scrollable: 'vertical',
           items: [{
               xtype: 'panel',
               id: 'markerInClustersId',
               autoScroll: true,
               layout: 'vbox',
               height: '100%',
               width: '30%'
           },
               {
                   xtype: 'panel',
                   id: 'infoMarkerId',
                   autoScroll: true,
                   height: '100%',
                   width: '70%'
               }
           ]
       }).showAt(coords);
       var markerInClusters = Ext.getCmp('markerInClustersId'),
           infoMarker = Ext.getCmp('infoMarkerId');
       markerInClusters.removeAll();
       cluster.features.forEach(function (marker) {
           markerInClusters.add(Ext.create('Ext.Button', {
               text: marker.customOptions.organizationName,
               maxWidth: 200,
               minWidth: 200,
               margin: 5,
               listeners: {
                   click: function () {

                       infoMarker.removeAll();
                       infoMarker.add(Ext.create('Ext.Panel', {
                           layout: 'form',
                           border: 'fit',
                           autoScroll: true,
                           width: '100%',
                           height: '100%',
                           items: [{
                               xtype: 'form',
                               margin: 0,
                               items: [{
                                   xtype: 'displayfield',
                                   value: marker.customOptions.organizationName,
                                   labelWidth: '100%',
                                   margin: 0
                               }]
                           }]
                       }))
                   }
               }
           }))
       })
   },*/

    markerClick: function (object) {
        function errorMessage() {
            Ext.create('Ext.window.MessageBox').show({
                title: 'Ошибка',
                message: 'Данные об организации временно не доступны',
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            })
        }

        const win = Ext.WindowManager.getActive();
        if (win) {
            win.close();
        }

        Ext.create('Ext.window.Window', {
            title: 'Мед. учереждение',
            layout: 'form',
            border: 'fit',
            resizable: false,
            width: 400,
            items: [{
                xtype: 'form',
                height: '100%',
                width: '100%',
                items: [{
                    xtype: 'form',
                    height: '100%',
                    width: '100%',
                    margin: 0,
                    items: [{
                        xtype: 'displayfield',
                        value: object.customOptions.organizationName,
                        labelWidth: '100%',
                        margin: 0
                    }]
                }]
            }]

        }).show();
    }
});
