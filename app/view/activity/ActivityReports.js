
Ext.define("MontessoriCompass.view.activity.ActivityReports",{
    extend: "Ext.navigation.View",
    xtype: 'activityreports',
    requires: [
        "MontessoriCompass.view.activity.ActivityReportsController",
        "MontessoriCompass.view.activity.ActivityReportsModel",
        'Ext.dataview.List'
    ],

    controller: "activityreports",
    viewModel: {
        type: "activityreports"
    },
    items: [
        {
            xtype: 'list',
            title: 'Activities',
            store: {
                model: 'MontessoriCompass.model.Activity',
                proxy: {
                    type: 'memory'
                }
            },
            itemTpl: ['<div><tpl if="isNew"><b></tpl>{title}<tpl if="isNew"></b></tpl></div>'],
            listeners: {
                itemsingletap: 'onActivitySelected'
            }
        }
    ]
});
