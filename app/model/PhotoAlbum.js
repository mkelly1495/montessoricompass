Ext.define('MontessoriCompass.model.PhotoAlbum', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'title', type: 'string' },
        { name: 'coverHref', type: 'string'},
        { name: 'href', type: 'string' }

    ]
});
