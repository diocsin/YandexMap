Ext.define('Isidamaps.services.heatMapForCall.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    heatmap: null,

    constructor: function (options) {
        const me = this;
        me.createMap();
        ymaps.modules.require(['Heatmap'], function (Heatmap) {
            me.heatmap = new Heatmap();
        });
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('load', function (store, records, options) {
            this.storeCall(records)
        }, this);

    },

    storeCall: function (records) {
        const me = this;
        Ext.Array.clean(me.callMarkers);
        records.forEach(function (call) {
            if (call.get('latitude') && call.get('longitude')) {
                const feature = me.createCallFeature(call);
                me.callMarkers.push(feature);
            }
        });
        me.heatmap.options.set('gradient', {
            0.1: 'rgba(128, 255, 0, 0.7)',
            0.2: 'rgba(255, 255, 0, 0.8)',
            0.7: 'rgba(234, 72, 58, 0.9)',
            1.0: 'rgba(162, 36, 25, 1)'
        });
        me.heatmap.options.set('radius', 15);
       // me.heatmap.options.set('blur', 200);
        me.heatmap.setData(me.callMarkers);
        me.heatmap.setMap(me.map);
    }

});
