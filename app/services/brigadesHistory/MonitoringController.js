Ext.define('Isidamaps.services.brigadesHistory.MonitoringController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.brigadesHistory',

    mainBoxReady: function () {
        ymaps.ready(() => {
            this.createClass();
        });
    },

    createClass: function () {
        this.myMask = new Ext.LoadMask({
            msg: 'Подождите пожалуйста. Загрузка...',
            target: Ext.getCmp('monitoringPanel')
        });
        this.myMask.show();
        this.Monitoring = Ext.create('Isidamaps.services.brigadesHistory.MapService', {
            addButtonsBrigadeOnPanel: this.addButtonsBrigadeOnPanel.bind(this),
            addStationFilter: this.addStationFilter.bind(this),
            getButtonBrigadeForChangeButton: this.getButtonBrigadeForChangeButton,
            setCheckboxAfterFirstLoad: this.setCheckboxAfterFirstLoad.bind(this),
            addNewButtonOnPanel: this.addNewButtonOnPanel.bind(this),
            destroyButtonOnPanel: this.destroyButtonOnPanel.bind(this),
        });
        this.Monitoring.createMap();
        this.Monitoring.searchControl();
        this.Monitoring.listenerStore();
        this.Monitoring.optionsObjectManager();
        ASOV.setMapManager({
            setStationAndTime: this.Monitoring.setStationAndTime.bind(this)
        }, Ext.History.currentToken);
        this.Monitoring.setStationAndTime(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']);
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
            this.Monitoring.resizeMap();
        });
    },

    layoutReady: function () {
        setTimeout(function(){
            Ext.get('loading').remove();
            Ext.get('loading-mask').fadeOut({remove:true});
        }, 250);
        this.fireTabEvent(this.lookupReference('navigationPanel'));
    },

    tabChange: function (panel, newTab, oldTab) {
        oldTab.fireEvent('tabExit');
        this.fireTabEvent(newTab);
    },

    fireTabEvent: function (tab) {
        tab.fireEvent('tabEnter');
    }
});
