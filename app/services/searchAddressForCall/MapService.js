Ext.define('Isidamaps.services.searchAddressForCall.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    feature: null,

    constructor: function (options) {
        const me = this;
        me.createMap();
        me.createButtonOnControlPanel();
        me.map.events.add('click', function (e) {
            const coords = e.get('coords');
            me.checkFeature(coords);
        });
    },

    createButtonOnControlPanel: function () {
        const me = this;
        const firstButton = new ymaps.control.Button({
            data: {
                content: "Подтвердить и закрыть",
            },
            options: {
                maxWidth: [28, 150, 178]
            }
        });
        firstButton.events.add('click', function f(e) {
            if (me.feature) {
                Ext.create('Ext.window.MessageBox').show({
                    title: 'Подтвердите действия',
                    message: me.feature.properties.getAll().balloonContent !== null ? me.feature.properties.getAll().balloonContent : me.feature.geometry.getCoordinates(),
                    icon: Ext.Msg.QUESTION,
                    buttons: Ext.Msg.YESNOCANCEL,
                    fn: function (btn) {
                        if (btn === 'yes') {
                            console.dir(me.feature.geometry.getCoordinates());
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
        me.map.controls.add(firstButton, {float: 'left'});
    },

    searchControl: function () {
        const me = this,
            searchControl = new ymaps.control.SearchControl({
                options: {
                    provider: 'yandex#map',
                    noPlacemark: true,
                    noSelect: true
                }
            });
        me.map.controls.add(searchControl);
        searchControl.events.add('resultselect', function (e) {
            // Получает массив результатов.
            const results = searchControl.getResultsArray();
            // Индекс выбранного объекта.
            const selected = e.get('index');
            // Получает координаты выбранного объекта.
            const point = results[selected].geometry.getCoordinates();
            const balloonContent = results[selected].properties.getAll().name;
            //me.map.balloon.open(point, balloonContent, {});
            me.checkFeature(point);

        });
    },

    checkFeature: function (coords) {
        const me = this;
        if (me.feature !== null) {
            me.feature.geometry.setCoordinates(coords);
            me.feature.properties.set('balloonContent', null);
        }
        else {
            me.feature = me.createPlacemark(coords);
            me.map.geoObjects.add(me.feature);

            // Слушаем событие окончания перетаскивания на метке.
            me.feature.events.add('dragend', function () {
                me.getAddress(me.feature.geometry.getCoordinates());
            });
        }
        me.getAddress(coords);
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
        const me = this;
        me.feature.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            const firstGeoObject = res.geoObjects.get(0);
            me.feature.properties
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
