Ext.define('Isidamaps.model.Call', {
    extend: 'Ext.data.Model',
    requires: ['Isidamaps.model.Brigade'],
    fields: ['longitude', 'latitude', 'statusAsov', 'station', 'status', {name: 'callCardId', type: 'int'},
        'callCardNum', 'createTime', 'lastUpdateTime', 'objectType', 'iconName'
    ],

    getObjectForMap: function () {
        return {
            type: 'Feature',
            id: this.get('callCardId'),
            customOptions: {
                objectType: this.get('objectType'),
                status: this.get('status'),
                callCardNum: this.get('callCardNum'),
                station: this.get('station').toString()
            },
            geometry: {
                type: 'Point',
                coordinates: [this.get('latitude'), this.get('longitude')]
            },
            options: {
                iconImageHref: `resources/icon/${this.get('iconName')}`,
                iconImageSize: [25, 31]
            }
        }
    },

    isCallHasCoordinates: function () {
        return (!!this.get('latitude') && !!this.get('longitude') &&
            this.get('latitude') !== 0.0 && this.get('longitude') !== 0.0);
    }
});
