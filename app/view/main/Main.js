/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MontessoriCompass.view.main.Main', {
    extend: 'Ext.Container',
    xtype: 'app-main',
    requires: [
        'Ext.TitleBar',
        'Ext.layout.Card',
        'Ext.layout.Fit',
        'Ext.tab.Panel',
        'MontessoriCompass.view.directory.Directory',
        'MontessoriCompass.view.login.Login',
        'MontessoriCompass.view.main.MainController',
        'MontessoriCompass.view.main.MainModel',
        'MontessoriCompass.view.message.Messages',
        'MontessoriCompass.view.photo.PhotoAlbums'
    ],
    controller: 'main',
    viewModel: 'main',
    layout: 'card',
    items: [
        {
            xtype: 'container',
            layout: 'fit',
            items: [
                {
                    xtype: 'titlebar',
                    title: 'User Login',
                    docked: 'top'
                },
                {
                    xtype: 'login',
                    reference: 'loginForm'
                }
            ]
        },
        {
            xtype: 'tabpanel',
            reference: 'tabview',
            defaults: {
                tab: {
                    iconAlign: 'top'
                },
                styleHtmlContent: true
            },
            tabBarPosition: 'bottom',
            items: [
                {
                    title: 'Messages',
                    iconCls: 'x-fa fa-envelope-o',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'messages',
                            reference: 'messages'
                        }
                    ]
                },
                {
                    title: 'Photos',
                    iconCls: 'x-fa fa-picture-o',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'photoalbums',
                            reference: 'photoalbums'
                        }
                    ]
                },
                {
                    title: 'Directory',
                    iconCls: 'x-fa fa-users',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'directory',
                            reference: 'directory'
                        }
                    ]
                }
            ],
            listeners: {
                activeitemchange: 'tabChanged'
            }
        }
    ]
});
