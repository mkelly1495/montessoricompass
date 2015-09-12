
Ext.define("MontessoriCompass.view.photo.PhotoAlbums", {
    extend: "Ext.navigation.View",
    xtype: 'photoalbums',
    requires: [
        "MontessoriCompass.view.photo.PhotoAlbumsController",
        "MontessoriCompass.view.photo.PhotoAlbumsModel",
        'Ext.Button',
        'Ext.dataview.List'
    ],
    controller: "photoalbums",
    viewModel: {
        type: "photoalbums"
    },
    reference: 'photoView',
    navigationBar: {
        titleAlign: 'center',
        backButton: {
            hidden: true,
            width: 0,
            text: '',
            reference: 'backButton'
        },
        viewModel: {
            data: {
                showBack: false
            }
        },
        bind: {
            controller: '{photoView.controller}'
        },
        docked: 'top',
        items: [
            {
                iconCls: 'x-fa fa-arrow-left',
                align: 'left',
                handler: 'onBack',
                ui: 'plain',
                bind: {
                    hidden: '{!showBack}'
                }
            }
        ]
    },
    items: [
        {
            xtype: 'list',
            itemId: 'albumslist',
            reference: 'albumslist',
            title: 'Photo Albums',
            store: [],
            itemTpl: [
                '<div style="display:inline-block; vertical-align:top;"><img src="{coverHref}"/></div>',
                '<div style="display:inline-block; padding-left: 10px;">{title}</div>'
            ],
            listeners: {
                itemsingletap: 'onPhotoAlbumSelected'
            }
        }
    ],
    listeners: {
        pop: 'updateButtonState',
        push: 'updateButtonState'
    }
});
