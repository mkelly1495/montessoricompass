
Ext.define("MontessoriCompass.view.message.NewMessage", {
    extend: "Ext.form.Panel",
    xtype: 'newmessage',
    requires: [
        'Ext.Button',
        'Ext.field.Hidden',
        'Ext.field.Text',
        'Ext.field.TextArea',
        'Ext.form.FieldSet',
        'Ext.layout.VBox'
    ],
    id: 'new_message',
    itemId: 'newMessage',
    scrollable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    viewModel: {
        data: {
            title: 'New Message',
            origContent: null,
            messageType: 'New', // options: New, Reply, Forward
            selectedRecipientIds: [],
            selectedRecipientText: '',
            authToken: null,
            subject: null,
            messageBody: null,
            users: []
        }
    },
    items: [
        {
            xtype: 'fieldset',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    name: 'utf8',
                    value: '✓'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'authenticity_token',
                    bind: {
                        value: '{authToken}'
                    }
                },
                {
                    xtype: 'hiddenfield',
                    name: 'message[recipient_ids][]',
                    reference: 'messageRecipients',
                    bind: {
                        value: '{selectedRecipientIds}'
                    }
                },
                {
                    xtype: 'hiddenfield',
                    name: 'message[body]',
                    id: 'message_body'
                },
                {
                    xtype: 'textareafield',
                    flex: 1,
                    name: 'recipients',
                    placeHolder: 'Tap to select recipients',
                    itemId: 'recipients',
                    label: 'To',
                    labelAlign: 'top',
                    readOnly: true,
                    maxRows: 20,
                    bind: {
                        value: '{selectedRecipientText}'
                    },
                    listeners: {
                        focus: 'onRecipientTextFocus'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'textfield',
                    id: 'message_subject',
                    label: 'Subject',
                    labelAlign: 'top',
                    name: 'message[subject]',
                    bind: {
                        value: '{subject}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            flex: 2,
            layout: {
                type: 'fit'
            },
            items: [
                {
                    xtype: 'textareafield',
                    label: 'Message',
                    itemId: 'messageBody',
                    scrollable: true,
                    labelAlign: 'top',
//                    autoCorrect: true,
//                    autoComplete: true,
//                    autoCapitalize: true,
                    maxRows: 20,
                    name: 'messageBody',
                    bind: {
                        value: '{messageBody}'
                    }
                }
            ]
        }
    ]
});
