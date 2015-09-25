/* 
 * This class provides a widget for selecting message recipients.
 */
Ext.define('MontessoriCompass.view.message.MessageRecipientSelector', {
    extend: 'Ext.Container',
    xtype: 'messagerecipientselector',
    requires: [
        'Ext.dataview.List',
        'Ext.layout.VBox',
        'Ext.layout.HBox',
        'Ext.field.Search',
        'Ext.Toolbar'
    ],
    itemId: 'messageRecipientSelector',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'toolbar',
            ui: 'searchbar',
            layout: {
                pack: 'center'
            },
            items: [
                {
                    xtype: 'searchfield',
                    placeHolder: 'Search...',
                    label: '',
                    labelWidth: 0,
                    listeners: {
                        change: function (self, newVal, oldVal) {
                            var store = self.up('messagerecipientselector').down('list').getStore();

                            if (!Ext.isEmpty(newVal)) {
                                store.filter([
                                    {
                                        property: 'name',
                                        value: newVal,
                                        anyMatch: true
                                    }
                                ]);
                            } else {
                                store.clearFilter();
                            }
                        }
                    }
                }
            ]
        },
        {
            xtype: 'list',
            flex: 1,
            mode: 'MULTI',
            newMessageForm: null,
            store: {
                model: 'MontessoriCompass.model.User',
                sorterFn: 'name',
                grouper: {
                    groupFn: function (record) {
                        return record.get('name')[0].toUpperCase();
                    }
                }
            },
            itemTpl: [
                '<div>{name}</div>'
            ],
            grouped: true,
            indexBar: true
        }
    ]
});


