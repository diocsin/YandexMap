Ext.define('Isidamaps.services.heatMapForCall.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    heatmap: null,
    myMask: null,

    constructor: function (options) {
        this.myMask =options.myMask;
        this.createMap();
        ymaps.modules.require(['Heatmap'], (Heatmap) => {
            this.heatmap = new Heatmap();
        });
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('load', (store, records, options) => {
            this.storeCall(records)
        }, this);

    },

    storeCall: function (records) {
        Ext.log({ outdent: 1},`${records.length} loadRecords`);
        this.myMask.hide();
        Ext.Array.clean(this.callMarkers);
        records.forEach((call) => {
            if (call.get('latitude') && call.get('longitude')) {
                const feature = this.createCallFeature(call);
                this.callMarkers.push(feature);
            }
        });
        this.heatmap.options.set('gradient', {
            0.1: 'rgba(128, 255, 0, 0.7)',
            0.2: 'rgba(255, 255, 0, 0.8)',
            0.7: 'rgba(234, 72, 58, 0.9)',
            1.0: 'rgba(162, 36, 25, 1)'
        });
        this.heatmap.options.set('radius', 15);
       // me.heatmap.options.set('blur', 200);
        this.heatmap.setData(this.callMarkers);
        this.heatmap.setMap(this.map);
    }

});
