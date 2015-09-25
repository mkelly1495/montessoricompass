
Ext.define("MontessoriCompass.view.message.Messages", {
    extend: "Ext.navigation.View",
    xtype: 'messages',
    requires: [
        "MontessoriCompass.view.message.MessagesController",
        "MontessoriCompass.view.message.MessagesModel",
        'Ext.Button',
        'Ext.dataview.List',
        'Ext.plugin.ListPaging'
    ],
    controller: "messages",
    viewModel: {
        type: "messages"
    },
    reference: 'messageView',
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
                viewingMessage: false,
                selectingRecipients: false,
                currRecord: null,
                showLogout: true,
                newMessage: false,
                showBack: false
            }
        },
        bind: {
            controller: '{messageView.controller}'
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
            },
            {
                iconCls: 'x-fa fa-sign-out',
                align: 'left',
                handler: 'onLogout',
                ui: 'plain',
                bind: {
                    hidden: '{!showLogout}'
                }
            },
            {
                iconCls: 'x-fa fa-refresh',
                align: 'right',
                handler: 'onRefresh',
                ui: 'plain',
                bind: {
                    hidden: '{!showLogout}'
                }
            },
            {
                iconCls: 'x-fa fa-plus',
                padding: '0 0 0 15',
                align: 'right',
                handler: 'onNewMessage',
                ui: 'plain',
                bind: {
                    hidden: '{!showLogout}'
                }
            },
            {
                iconCls: 'x-fa fa-reply',
                align: 'right',
                ui: 'plain',
                handler: 'onReplyMessage',
                bind: {
                    hidden: '{!viewingMessage}'
                }
            },
            {
                iconCls: 'x-fa fa-share',
                padding: '0 0 0 15',
                align: 'right',
                ui: 'plain',
                handler: 'onForwardMessage',
                bind: {
                    hidden: '{!viewingMessage}'
                }
            },
            {
                iconCls: 'x-fa fa-check',
                align: 'right',
                style: 'color: green',
                ui: 'plain',
                handler: 'onRecipientsSelected',
                bind: {
                    hidden: '{!selectingRecipients}'
                }
            },
            {
                iconCls: 'x-fa fa-user-times',
                padding: '0 0 0 15',
                align: 'right',
                style: 'color: #A62F2F',
                ui: 'plain',
                handler: 'onDeselectAllRecipients',
                bind: {
                    hidden: '{!selectingRecipients}'
                }
            },
            {
                iconCls: 'x-fa fa-send',
                align: 'right',
                style: 'color: green',
                ui: 'plain',
                handler: 'onNewMessageSubmit',
                bind: {
                    hidden: '{!newMessage}'
                }
            }
        ]
    },
    items: [
        {
            xtype: 'list',
            title: 'Messages',
            infinite: true,
            reference: 'messagelist',
            store: [],
            itemTpl: [
                '<div><tpl if="isNew"><b></tpl>From: {sender} <span style="float: right;">{shortDate}</span><tpl if="isNew"></b></tpl></div>',
                '<div><tpl if="isNew"><b></tpl>{subject}<tpl if="isNew"></b></tpl></div>'
            ],
            listeners: {
                itemsingletap: 'onMessageSelected'
            },
            plugins: [
                {
                    xclass: 'Ext.plugin.ListPaging',
                    autoPaging: true
                }
            ]
        }
    ],
    listeners: {
        pop: 'updateButtonState',
        push: 'updateButtonState'
    }
});
