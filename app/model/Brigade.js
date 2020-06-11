Ext.define('Isidamaps.model.Brigade', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'deviceId', type: 'int'}, 'brigadeNum', 'station', 'longitude', 'latitude',
        'statusAsov', 'status', 'profile', 'timeLocal', 'lastUpdateTime',
        'iconName', 'objectType', 'callCardNum', 'callCardId', {name: 'speed', type: 'int'}, 'vector'
    ],
    getObjectForMap: function () {
        const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #000000;  border: 1px solid; display: inline-block; background-color: #faf8ff; text-align: center; border-radius: 6px; z-index: 2;font-size: 12pt">$[properties.iconContent]</div>'
        );
        return {
            type: 'Feature',
            id: this.get('deviceId'),
            customOptions: {
                objectType: this.get('objectType'),
                profile: this.get('profile'),
                status: this.get('status'),
                station: this.get('station').toString(),
                brigadeNum: this.get('brigadeNum'),
                speed: this.get('speed'),
                vector: this.get('vector'),
            },
            geometry: {
                type: 'Point',
                coordinates: [this.get('latitude'), this.get('longitude')]
            },
            options: {
                iconLayout: 'default#imageWithContent',
                iconImageHref: `resources/icon/${this.get('iconName')}`,
                iconContentLayout: MyIconContentLayout,
                iconImageOffset: [-24, -24],
                iconContentOffset: [30, -10],
            },
            properties: {
                hintContent: `Бригада ${this.get('brigadeNum')}, ${this.get('speed')} км/ч`,
                iconContent: `${this.get('brigadeNum')}(${this.get('profile')})`,
            }
        }
    },

    isBrigadeHasCoordinates: function () {
        return (!!this.get('latitude') && !!this.get('longitude'));
    }
});
