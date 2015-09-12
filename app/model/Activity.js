Ext.define('MontessoriCompass.model.Activity', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'isNew', type: 'boolean'},
        { name: 'title', type: 'string' },
        { name: 'href', type: 'string' }

    ]
});
