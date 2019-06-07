describe("Isidamaps.services.monitoring.MapService", function () {
    let monitoring = null;
    let monitoringController = null;
    beforeAll(function (done) {
        Ext.Loader.loadScript({
            url: 'https://api-maps.yandex.ru/2.1/?apikey=e3136019-9627-4206-9608-53ee2ea6e891&lang=ru-RU',
            onError: () => {
                Ext.log({indent: 1, level: 'error'}, 'Нет доступа к yandexApi');
            },
            onLoad: () => {
                ymaps.ready(() => {
                    monitoringController = Ext.create('Isidamaps.services.monitoring.MonitoringController');
                    monitoring = Ext.create('Isidamaps.services.monitoring.MapService', {
                        addButtonsBrigadeOnPanel: monitoringController.addButtonsBrigadeOnPanel.bind(this),
                        addStationFilter: monitoringController.addStationFilter.bind(this),
                        getButtonBrigadeForChangeButton: monitoringController.getButtonBrigadeForChangeButton,
                        setCheckboxAfterFirstLoad: monitoringController.setCheckboxAfterFirstLoad.bind(this),
                        addNewButtonOnPanel: monitoringController.addNewButtonOnPanel.bind(this),
                        destroyButtonOnPanel: monitoringController.destroyButtonOnPanel.bind(this),
                    });

                    done();
                });
            }
        });


    });

    describe('createBrigadeFeature() method', function () {
        const brigadeForYandex = {
            type: 'Feature',
            id: 956,
            customOptions:
                Object({
                    objectType: 'BRIGADE',
                    profile: 'Фелд',
                    status: 'GO_HOSPITAL',
                    station: '9',
                    brigadeNum: '956',
                    speed: 60,
                    vector: 105
                }),
            geometry:
                Object({type: 'Point', coordinates: [53.91698559746146, 27.596753099933267]}),
            options:
                Object({
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: 'resources/icon/go_hospital.png',
                    iconContentLayout: null,
                    iconImageOffset: [-24, -24],
                    iconContentOffset: [30, -10]
                }),
            properties:
                Object({hintContent: 'Бригада 956', iconContent: '956(Фелд)', speedContent: 60})
        };

        it("should be create Brigade for YandexMap", function (done) {
            const brigadeStore = Ext.create('Isidamaps.store.BrigadesFirstLoadStore');
            brigadeStore.load({
                url: '/brigadeTest.json',
                callback: (records, operation, success) => {
                    if (success) {
                        records.forEach(brigade => {
                            if (brigade.get('latitude') && brigade.get('longitude')) {
                                expect(monitoring.createBrigadeFeature(brigade)).toEqual(brigadeForYandex);
                                done();
                            }
                        });
                    }
                }
            });

        });
    });

    describe('createCallFeature() method', function () {
        const callForYandex = {
            type: 'Feature',
            id: 123,
            customOptions:
                Object({
                    objectType: 'CALL',
                    status: 'NEW',
                    station: '9',
                    callCardNum: '123',
                }),
            geometry:
                Object({type: 'Point', coordinates: [53.91698559746146, 27.596753099933267]}),
            options:
                Object({iconImageHref: 'resources/icon/new.png', iconImageSize: [25, 31]})
        };
        it("should be create Call for YandexMap", function (done) {
            const callStore = Ext.create('Isidamaps.store.CallsFirstLoadStore');
            callStore.load({
                url: '/callTest.json',
                callback: (records, operation, success) => {
                    if (success) {
                        records.forEach(call => {
                            if (call.get('latitude') && call.get('longitude')) {
                                expect(monitoring.createCallFeature(call)).toEqual(callForYandex);
                                done();
                            }
                        });
                    }
                }
            });
        });
    });

    describe('getProperty', function () {
        let appController = null;
        beforeEach(function (done) {
            appController = Isidamaps.getApplication().controllers.get('AppController');
            appController.initial(done);
        });
        it("property geoData", function (done) {
            expect(appController.urlGeodata).not.toBeUndefined();
            done();
        });
        it("property webSocket", function (done) {
            expect(appController.urlWebSocket).not.toBeUndefined();
            done();
        });
    });

    describe('getMessageBrigadeFromWS', function () {
        const brigade = {
                deviceId: 959,
                brigadeNum: "959",
                station: 9,
                longitude: 27.583282627165318,
                latitude: 53.90055648051202,
                statusAsov: 720,
                status: "PASSED_BRIGADE",
                profile: "Фелд",
                callCardId: 113162718,
                callCardNum: 15709,
                timeLocal: "2019-06-06T16:08:19.819",
                lastUpdateTime: "2019-06-06T16:08:53.185",
                iconName: "passed_brigade.png",
                objectType: "BRIGADE",
                speed: 60,
                vector: 105
            },
            call = {
                longitude: 27.440226,
                latitude: 53.856233,
                statusAsov: 800,
                status: "NEW",
                callCardId: 113164456,
                callCardNum: 15849,
                createTime: "2019-06-06T17:16:05.463",
                lastUpdateTime: "2019-06-06T17:16:05.500",
                objectType: "CALL",
                iconName: "new.png",
                station: 6
            };
        let brigadeFromWS = null;
        let callFromWS = null;
        beforeEach(function (done) {
            Ext.getStore('Isidamaps.store.BrigadeFromWSStore').on('add', (store, records, index) => {
                brigadeFromWS = records[0];
            }, this);

            Ext.getStore('Isidamaps.store.CallFromWSStore').on('add', (store, records, index) => {
                callFromWS = records[0];
            }, this);
            let appController = Isidamaps.getApplication().controllers.get('AppController');
            appController.brigadeId = '959';
            appController.callId = '113164456';
            appController.addMarkerInStoreFromWSForMonitoringBrigade(brigade);
            appController.addMarkerInStoreFromWSForMonitoringBrigade(call);
            done();
        });

        it('loadMessageBrigade', function (done) {
            expect(brigadeFromWS).not.toBeNull();
            done();
        });
        it('loadMessageCall', function (done) {
            expect(callFromWS).not.toBeNull();
            done();
        });
    });

    describe('getEngStatus', function () {
        const eng = ['FREE', 'ON_EVENT', 'WITHOUT_SHIFT', 'CRASH_CAR', 'PASSED_BRIGADE', 'AT_CALL', 'RELAXON', 'GO_HOSPITAL', 'HIJACKING'];
        it('notUndefined', function () {
            eng.forEach(function (status) {
                expect(Isidamaps.getApplication().controllers.get('AppController').getBrigadeStatuses(status)).not.toEqual('Неизвестно');
            });

        })
    });

    describe('getStoreAboutMarker', function () {
        beforeEach(function (done) {
            Isidamaps.getApplication().controllers.get('AppController').urlGeodata = 'http://localhost';
            done();
        });
        it('Brigade', function () {
            expect(Isidamaps.getApplication().controllers.get('AppController').getStoreAboutMarker('BRIGADE').getProxy().getUrl()).toEqual('http://localhost/info');
            expect(Isidamaps.getApplication().controllers.get('AppController').getStoreAboutMarker('BRIGADE').getId()).toEqual('Isidamaps.store.BrigadeInfoStore');

        })
    });
});