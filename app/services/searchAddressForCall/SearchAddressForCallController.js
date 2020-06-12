Ext.define('Isidamaps.services.searchAddressForCall.SearchAddressForCallController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.searchAddressForCall',
    SearchAddressForCall: null,
    listen: {
        global: {
            sendCoordinateToASOV: 'sendCoordinateToASOV'
        }
    },

    sendCoordinateToASOV: function () {
        let win = Ext.WindowManager.getActive();
        if (win) {
            win.close();
        }
        this.SearchAddressForCall.checkFeature(this.SearchAddressForCall.coordinate);
    },

    createClass: function () {
        Isidamaps.app.getController('AppController').initial(Ext.emptyFn);
        this.SearchAddressForCall = Ext.create('Isidamaps.services.searchAddressForCall.MapService', {
        });
        this.SearchAddressForCall.searchControl();
        ASOV.setMapManager({
            setStreet: this.SearchAddressForCall.setStreet.bind(this),
            setCoordinateHouse: this.SearchAddressForCall.setCoordinateHouse.bind(this),
            clean: this.SearchAddressForCall.cleanMap.bind(this)
        }, Ext.History.currentToken);
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
            this.SearchAddressForCall.resizeMap();
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
