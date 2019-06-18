Ext.define('Isidamaps.services.heatMapForCall.HeatMapForCallController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.heatMapForCall',
    HeatMapForCall: null,
    listen: {
        global: {
            applyFilterHeatMap: 'applyFilterHeatMap'
        }
    },

    applyFilterHeatMap: function () {
        let params = {},
            stations = [],
            brigadeprofiles = [],
            diagnosis = [],
            alcointoxication = '',
            stationGroup = Ext.getCmp('stationGroupId'),
            profileGroup = Ext.getCmp('profileGroupId'),
            alcointoxicationGroup = Ext.getCmp('alco_intoxication_GroupId'),
            sexGroup = Ext.getCmp('sexGroupId');
        let checkFields = () => {
            let check = true;
            if (Ext.getCmp('beginTime').rawValue == '') {
                Ext.getCmp('beginTime').setActiveError('Введи дату начала отсчета');
                check = false;
            }
            if (Ext.getCmp('endTime').rawValue == '') {
                Ext.getCmp('endTime').setActiveError('Введи дату окончания отсчета');
                check = false;
            }
            return check;
        };
        if (!checkFields()) {
            return
        }
        stationGroup.items.each(checkbox => {
            if (checkbox.checked) {
                stations.push(checkbox.inputValue);
            }
        });
        profileGroup.items.each(checkbox => {
            if (checkbox.checked) {
                brigadeprofiles.push(checkbox.inputValue)
            }
        });
        sexGroup.items.each(checkbox => {
            if (checkbox.checked) {
                params.patientsex = checkbox.inputValue;
            }
        });
        alcointoxicationGroup.items.each(checkbox => {
            if (checkbox.checked) {
                alcointoxication = checkbox.inputValue
            }
        });
        const diagnosisStore = Ext.getStore('Isidamaps.store.DiagnosisGridStore');
        diagnosisStore.getData().items.forEach((row) => {
            diagnosis.push(row.getData().value);
        });

        if (Ext.getCmp('beginTime').rawValue !== '') {
            params.timestart = new Date(Ext.getCmp('beginTime').value).toISOString();
        }
        if (Ext.getCmp('endTime').rawValue !== '') {
            params.timeend = new Date(Ext.getCmp('endTime').value).toISOString();
        }
        Ext.getCmp('age').rawValue != '' ? params.patientage = Ext.getCmp('age').rawValue : undefined;
        Ext.getCmp('district_auto_complete').rawValue != '' ? params.district = Ext.getCmp('district_auto_complete').rawValue : undefined;
        Ext.getCmp('street_auto_complete').rawValue != '' ? params.street = Ext.getCmp('street_auto_complete').rawValue : undefined;
        Ext.getCmp('reason_auto_complete').rawValue != '' ? params.reason = Ext.getCmp('reason_auto_complete').rawValue : undefined;
        params.stations = stations;
        params.diagnosis = diagnosis;
        params.brigadeprofile = brigadeprofiles;
        params.alcointoxication = alcointoxication;

        const doAjax = () => {
            this.myMask.show();
            Ext.Ajax.request({
                url: Ext.String.format(`${Isidamaps.app.getController('AppController').urlGeodata}/point`),
                params: params,
                method: 'GET',
                success: (response, opts) => {
                    let obj = Ext.decode(response.responseText);
                    this.HeatMapForCall.getPointsFromStore(obj);
                    this.myMask.hide();
                    Ext.log({indent: 1}, `Load success from ${ Isidamaps.app.getController('AppController').urlGeodata}/point`);
                },
                failure: (response, opts) => {
                    Ext.log({indent: 1, level: 'error'}, `server-side failure with status code ${response.status}`);
                }
            });
        };
        doAjax();
    },

    checkedFilter: function (checkbox, reference, inputValueAllCheckBox) {
        const {inputValue, checked} = checkbox,
            groupFilterComp = this.lookupReference(reference);
        if (!checked) {
            this.uncheckCheckBoxInFilter(groupFilterComp, inputValue, inputValueAllCheckBox);
            return;
        }
        this.checkCheckBoxInFilter(groupFilterComp, inputValue, inputValueAllCheckBox)
    },

    checkCheckBoxInFilter: function (groupFilterComp, inputValue, inputValueAllCheckBox) {
        let j = 0;
        Ext.Array.remove(this.filterMarkerArray, inputValue);

        groupFilterComp.items.each(checkbox => {
            if (checkbox.checked) {
                j++
            }
        });
        if (groupFilterComp.items.length === j) {
            this.lookupReference(inputValueAllCheckBox).setRawValue(true)
        }
        groupFilterComp.fireEvent('customerchange');
    },

    uncheckCheckBoxInFilter: function (groupFilterComp, inputValue, inputValueAllCheckBox) {
        let i = 0;
        this.filterMarkerArray.push(inputValue);


        groupFilterComp.items.each(checkbox => {
            if (checkbox.checked) {
                i++
            }
        });
        if (groupFilterComp.items.length === i + 1) {
            this.lookupReference(inputValueAllCheckBox).setRawValue(false)
        }
        groupFilterComp.fireEvent('customerchange');
    },

    createClass: function () {
        this.myMask = new Ext.LoadMask({
            msg: 'Подождите пожалуйста. Загрузка...',
            target: Ext.getCmp('heatMapForCallPanel')
        });
        this.HeatMapForCall = Ext.create('Isidamaps.services.heatMapForCall.MapService', {});
        this.myMask.show();
        this.HeatMapForCall.optionsObjectManager();
        this.HeatMapForCall.listenerStore();
        Isidamaps.app.getController('AppController').initial(Ext.emptyFn);
        this.setStationFilter();
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
            this.HeatMapForCall.resizeMap();
        });
    },

    setStationFilter: function () {
        const stations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 50],
            groupFilterStation = this.lookupReference('stationFilter');

        Ext.Array.each(stations, stationName => {
            groupFilterStation.add(Ext.create('Ext.form.field.Checkbox', {
                boxLabel: stationName,
                inputValue: stationName,
                checked: false,
                width: 100,
                listeners: {
                    change: {
                        fn: (checkbox, checked) => {
                            Ext.fireEvent('checkedFilter', checkbox, 'stationFilter', Isidamaps.app.globals.ALL_STATIONS);
                        }
                    }
                }
            }));
        });
        this.myMask.hide();
    },

    layoutReady: function () {
    },

    tabChange: function (panel, newTab, oldTab) {
    },

    fireTabEvent: function (tab) {
    },
});
