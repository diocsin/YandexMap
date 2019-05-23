Ext.define('Isidamaps.services.searchAddressForCall.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    feature: null,

    constructor: function (options) {
        this.createMap();
        this.createButtonOnControlPanel();
        this.map.events.add('click', e => {
            const coords = e.get('coords');
            this.checkFeature(coords);
        });
    },

    createButtonOnControlPanel: function () {
        const ButtonLayout = ymaps.templateLayoutFactory.createClass([
            '<div title="{{ data.title}}" class="button_confirm">',
            '{{ data.content}}',
            '</div>'
        ].join(''));
        const firstButton = new ymaps.control.Button({
            data: {
                content: "Подтвердить",
                title: "Подтвердить координаты"
            },
            options: {
                layout: ButtonLayout,
                maxWidth: [28, 150, 178]
            }
        });
        firstButton.events.add('click', e => {
            if (this.feature) {
                const {properties, geometry} = this.feature;
                Ext.create('Ext.window.MessageBox').show({
                    title: 'Подтвердите действия',
                    message: properties.getAll().balloonContent ? properties.getAll().balloonContent : geometry.getCoordinates(),
                    icon: Ext.Msg.QUESTION,
                    buttons: Ext.Msg.YESNOCANCEL,
                    fn: btn => {
                        if (btn === 'yes') {
                            console.dir(geometry.getCoordinates());
                            Isidamaps.app.getController('AppController').windowClose();
                        } else if (btn === 'no') {

                        } else {

                        }
                    }
                });
            }
            else {
                Ext.create('Ext.window.MessageBox').show({
                    title: 'Ошибка',
                    message: 'Не указан адрес вызова',
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                })
            }
        });
        this.map.controls.add(firstButton, {float: 'left'});
    },

    searchControl: function () {
        const searchControl = new ymaps.control.SearchControl({
            options: {
                provider: 'yandex#map',
                noPlacemark: true,
                noSelect: true
            }
        });
        this.map.controls.add(searchControl);
        searchControl.events.add('resultselect', e => {
            // Получает массив результатов.
            const results = searchControl.getResultsArray();
            // Индекс выбранного объекта.
            const selected = e.get('index');
            // Получает координаты выбранного объекта.
            const point = results[selected].geometry.getCoordinates();
            const balloonContent = results[selected].properties.getAll().name;
            //this.map.balloon.open(point, balloonContent, {});
            this.checkFeature(point);

        });
    },

    checkFeature: function (coords) {
        if (this.feature !== null) {
            this.feature.geometry.setCoordinates(coords);
            this.feature.properties.set('balloonContent', null);
        }
        else {
            this.feature = this.createPlacemark(coords);
            this.map.geoObjects.add(this.feature);
            // Слушаем событие окончания перетаскивания на метке.
            this.feature.events.add('dragend', () => {
                this.getAddress(this.feature.geometry.getCoordinates());
            });
        }
        this.getAddress(coords);
    },

    createPlacemark: function (coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'

        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true,
            iconCaptionMaxWidth: 350
        });
    },

    getAddress: function (coords) {
        this.feature.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(res => {
            const firstGeoObject = res.geoObjects.get(0);
            this.feature.properties
                .set({
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()
                });
        });
    }
});
