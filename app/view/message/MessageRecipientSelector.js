/* 
 * This class provides a widget for selecting message recipients.
 */
Ext.define('MontessoriCompass.view.message.MessageRecipientSelector', {
    extend: 'Ext.dataview.List',
    xtype: 'messagerecipientselector',
    itemId: 'messageRecipientSelector',
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
});


