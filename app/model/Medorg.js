Ext.define('Isidamaps.model.Medorg', {
    extend: 'Ext.data.Model',
    fields: ['longitude', 'latitude', 'organizationId', 'organizationType', 'organizationName', 'lastUpdateTime', 'objectType', 'iconName'],

    getObjectForMap: function () {
        return {
            type: 'Feature',
            id: this.get('organizationId'),
            customOptions: {
                objectType: this.get('objectType'),
                organizationName: this.get('organizationName')
            },
            geometry: {
                type: 'Point',
                coordinates: [this.get('latitude'), this.get('longitude')]
            },
            options: {
                iconImageHref: `resources/icon/${this.get('iconName')}`
            },
            properties: {
                hintContent: this.get('organizationName')
            }
        }
    },

    isMedOrgHasCoordinates: function () {
        return (!!this.get('latitude') && !!this.get('longitude'))
    }
});
