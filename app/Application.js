/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Isidamaps.Application', {
    extend: 'Ext.app.Application',
    requires: ['Isidamaps.services.monitoring.Monitoring',
        'Isidamaps.services.monitoringBrigadeOnCall.MonitoringBrigade',
        'Isidamaps.services.brigadeForAssign.BrigadeForAssign',
        'Isidamaps.services.callHistory.CallHistory',
        'Isidamaps.services.medorg.Medorg',
        'Isidamaps.services.heatMapForCall.HeatMapForCall',
        'Isidamaps.services.searchAddressForCall.SearchAddressForCall'
    ],
    controllers: 'Isidamaps.controller.AppController',

    name: 'Isidamaps',

    stores: [
        'Isidamaps.store.SettingsStore',
        'Isidamaps.store.BrigadesFirstLoadStore',
        'Isidamaps.store.CallsFirstLoadStore',
        'Isidamaps.store.BrigadeFromWebSockedStore',
        'Isidamaps.store.CallFromWebSockedStore',
        'Isidamaps.store.CallInfoStore',
        'Isidamaps.store.BrigadeInfoStore',
        'Isidamaps.store.RouteForTableStore',
        'Isidamaps.store.RouteHistoryStore',
        'Isidamaps.store.FactRouteHistoryStore',
        'Isidamaps.store.MedOrgStore'
    ],

    routes: {
        ':id': 'changeRoute'
    },

    launch: function () {
        // TODO - Launch the application
        if (Ext.supports.LocalStorage) {
            Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());
        }
        else {
            Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    changeRoute: function (id) {
        const viewport = Ext.getCmp('content');
        viewport.removeAll();
        viewport.add({
            xtype: id
        });
    },

    onUnmatchedRoute: function (hash) {
        console.log('Unmatched', hash);
        // Do something...
    },

    defaultToken: 'monitoring'
});
