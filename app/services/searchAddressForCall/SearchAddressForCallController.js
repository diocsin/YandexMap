Ext.define('Isidamaps.services.searchAddressForCall.SearchAddressForCallController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.searchAddressForCall',

    createClass: function () {
        const SearchAddressForCall = Ext.create('Isidamaps.services.searchAddressForCall.MapService', {
        });
        SearchAddressForCall.searchControl();
        Isidamaps.app.getController('AppController').initial(Ext.emptyFn);
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            SearchAddressForCall.resizeMap();
        });
    },

    layoutReady: function () {
        setTimeout(function(){
            Ext.get('loading').remove();
            Ext.get('loading-mask').fadeOut({remove:true});
        }, 250);
    },

    tabChange: function (panel, newTab, oldTab) {
    },

    fireTabEvent: function (tab) {
    },
});
