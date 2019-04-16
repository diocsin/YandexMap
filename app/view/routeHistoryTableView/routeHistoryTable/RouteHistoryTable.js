Ext.define('Isidamaps.view.routeHistoryTableView.routeHistoryTable.RouteHistoryTable', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.routeHistoryTableView-routeHistoryTable',
    border: false,
    id: 'MyGrid',
    title: 'Table Layout',
    store: 'Isidamaps.store.RouteHistoryTableStore',
    loadMask: true,
    selModel: {
        pruneRemoved: false
    },
    viewConfig: {
        markDirty: false,
        trackOver: false
    },
    features: [{
        ftype: 'grouping',
        collapseTip: 'Скрыть',
        expandTip: 'Раскрыть'
    }],
    width: '100%',
    columns: [
        {
            xtype: 'rownumberer',
            width: 40,
            sortable: false
        },
        {
            text: 'Адрес',
            dataIndex: 'place',
            hidden: true,
            sortable: false
        },
        {
            text: 'Координаты',
            dataIndex: 'point',
            groupable: false,
            sortable: false,
            flex: 2,
            fixed: true
        },
        {
            text: 'Время',
            dataIndex: 'time',
            groupable: false,
            sortable: false,
            renderer: Ext.util.Format.dateRenderer('Y-m-d, H:i:s'),
            flex: 2,
            fixed: true

        },
        {
            text: 'Скорость',
            dataIndex: 'speed',
            groupable: false,
            sortable: false,
            flex: 1,
            fixed: true
        },
    ],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        ui: 'footer',
        items: [{
            xtype: 'component',
            flex: 1
        },
            {
                text: 'Печать',
                listeners: {
                    click: function () {
                        const myGrid = Ext.getCmp('MyGrid');
                        Ext.ux.grid.Printer.print(myGrid);
                    }
                }
            }
        ]
    }],
    renderTo:
        Ext.getBody()
})
;
