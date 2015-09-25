
Ext.define("MontessoriCompass.view.directory.Directory", {
    extend: "Ext.navigation.View",
    xtype: 'directory',
    requires: [
        "MontessoriCompass.view.directory.DirectoryController",
        "MontessoriCompass.view.directory.DirectoryModel",
        'MontessoriCompass.model.DirectoryEntry',
        'Ext.dataview.List',
        'Ext.Toolbar',
        'Ext.field.Search'
    ],
    controller: "directory",
    viewModel: {
        type: "directory"
    },
    items: [
        {
            xtype: 'container',
            title: 'Student Directory',
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
                                    var store = self.up('directory').down('list').getStore();
                                    var regExp = new RegExp(newVal, "i");

                                    if (!Ext.isEmpty(newVal)) {
                                        store.filter([
                                            {
                                                filterFn: function (item) {
                                                    return regExp.test(item.get('parentNames'))
                                                            || regExp.test(item.get('childName'));
                                                }
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
                    reference: 'directoryList',
                    store: [],
                    itemTpl: ['<div><b>{childName}</b></div>',
                        '<div>{parentNames}</div>'],
                    grouped: true,
                    indexBar: true,
                    listeners: {
                        itemsingletap: 'onUserSelected'
                    }
                }
            ]
        }
    ]
});
