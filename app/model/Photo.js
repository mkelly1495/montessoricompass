Ext.define('MontessoriCompass.model.Photo', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'smallHref', type: 'string' },
        { name: 'href', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'dateTaken', type: 'string' }
        
    ]
});
