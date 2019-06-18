/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.ariaWarn = Ext.emptyFn;
ASOV = (() => {
    const opener = window.opener;
    return !!opener ? opener.ACPS.MapControl.forExport() : {
        setRoutes: Ext.emptyFn,
        setBrigade: Ext.emptyFn,
        setHospital: Ext.emptyFn,
        setMapManager: Ext.emptyFn
    }
})();

function readPropertyFile() {
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", 'resources/settings/property.json', true);
    rawFile.onreadystatechange = () => {
        if (rawFile.readyState === 4 && rawFile.status === 200) {
            const data = Ext.decode(rawFile.responseText);
            startApp(data.urlYandex);
        }
        else if (rawFile.status !== 200) {
            Ext.log({indent: 1, level: 'error'}, `Ошибка чтения файла property, status ${rawFile.status}`);
        }
    };

    rawFile.send(null);
}

readPropertyFile();

function startApp(urlYandex) {
    Ext.Loader.loadScript({
        url: [urlYandex, 'resources/lib/heatmap.min.js'],
        onError: () => {
            Ext.log({indent: 1, level: 'error'}, 'Нет доступа к yandexApi');
        }
    });
    Ext.application({
        name: 'Isidamaps',

        extend: 'Isidamaps.Application',
        requires: [
            'Ext.layout.container.Border',
            'Ext.layout.container.Table',
            'Ext.form.CheckboxGroup',
            'Ext.container.Viewport',
            'Isidamaps.Viewport',
            'Ext.container.Container',
            'Ext.ux.grid.Printer',
            'Ext.ux.DateTimePicker',
            'Ext.ux.DateTimeField'

        ],
        // The name of the initial view to create. With the classic toolkit this class
        // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
        // modern toolkit, the main view will be added to the Viewport.
        //
        mainView: 'Isidamaps.Viewport'

        //-------------------------------------------------------------------------
        // Most customizations should be made to Isidamaps.Application. If you need to
        // customize this file, doing so below this section reduces the likelihood
        // of merge conflicts when upgrading to new versions of Sencha Cmd.
        //-------------------------------------------------------------------------
    });
}
