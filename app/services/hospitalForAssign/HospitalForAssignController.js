Ext.define('Isidamaps.services.hospitalForAssign.HospitalForAssignController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.hospitalforassign',
    HospitalForAssign: null,

    createClass: function () {
        this.HospitalForAssign = Ext.create('Isidamaps.services.hospitalForAssign.MapService', {});
        ASOV.setMapManager({
            setMarkers: this.HospitalForAssign.setMarkers.bind(this)
        }, Ext.History.currentToken);
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
            this.HospitalForAssign.resizeMap();
        })
    },

    layoutReady: function () {
    },
});
