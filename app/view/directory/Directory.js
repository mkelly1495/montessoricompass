
Ext.define("MontessoriCompass.view.directory.Directory", {
    extend: "Ext.navigation.View",
    xtype: 'directory',
    requires: [
        "MontessoriCompass.view.directory.DirectoryController",
        "MontessoriCompass.view.directory.DirectoryModel",
        'MontessoriCompass.model.DirectoryEntry',
        'Ext.dataview.List'
    ],
    controller: "directory",
    viewModel: {
        type: "directory"
    },
    items: [
        {
            xtype: 'list',
            title: 'Student Directory',
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
});
