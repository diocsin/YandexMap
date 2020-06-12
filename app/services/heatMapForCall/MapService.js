Ext.define('Isidamaps.services.heatMapForCall.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    heatmap: null,

    constructor: function (options) {
        this.createMap();
        ymaps.modules.require(['Heatmap'], (Heatmap) => {
            this.heatmap = new Heatmap();
        });
    },

    getPointsFromStore: function (obj) {
        // Ext.log({outdent: 1}, `${records.length} loadRecords`);
        this.heatmap.options.set('gradient', {
            0.1: 'rgba(128, 255, 0, 0.7)',
            0.2: 'rgba(255, 255, 0, 0.8)',
            0.7: 'rgba(234, 72, 58, 0.9)',
            1.0: 'rgba(162, 36, 25, 1)'
        });
        this.heatmap.options.set('radius', 15);
        // me.heatmap.options.set('blur', 200);
        this.heatmap.setData(obj);
        this.heatmap.setMap(this.map);
    }

});
