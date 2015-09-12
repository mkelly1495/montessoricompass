Ext.define('MontessoriCompass.model.Message', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'isNew', type: 'boolean'},
        {name: 'sender', type: 'string'},
        {name: 'subject', type: 'string'},
        {name: 'date', type: 'string' },
        {name: 'href', type: 'string'},
        {name: 'replyLink', type: 'string'},
        {name: 'forwardLink', type: 'string'}
    ]
});
