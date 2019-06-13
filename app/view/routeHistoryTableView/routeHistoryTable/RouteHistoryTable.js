Ext.define('Isidamaps.view.routeHistoryTableView.routeHistoryTable.RouteHistoryTable', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.routeHistoryTableView-routeHistoryTable',
    border: false,
    id: 'GridHistory',
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
        enableNoGroups: false,
        collapseTip: 'Скрыть',
        expandTip: 'Раскрыть'
    }],
    width: '100%',
    columns: [
        {
            xtype: 'rownumberer',
            width: 60,
            sortable: false
        },
        {
            text: 'Адрес',
            dataIndex: 'place',
            hidden: true,
            sortable: false
        },
       /* {
            text: 'Координаты',
            dataIndex: 'point',
            groupable: false,
            sortable: false,
            flex: 1,
            fixed: true
        },*/
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
            text: 'Скорость<br>(км/ч)',
            dataIndex: 'speed',
            groupable: false,
            sortable: false,
            flex: 1,
            fixed: true
        },
        {
            text: 'Расстояние(км)',
            dataIndex: 'distance',
            groupable: false,
            sortable: false,
            flex: 2,
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
                        const myGrid = Ext.getCmp('GridHistory');
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
