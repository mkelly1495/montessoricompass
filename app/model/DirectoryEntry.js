Ext.define('MontessoriCompass.model.DirectoryEntry', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'childName', type: 'string' },
        { name: 'parentNames', type: 'string' },
        { name: 'sendMessageHref', type: 'string' }

    ]
});
