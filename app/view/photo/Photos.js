/**
 * This view is an example list of people.
 */
Ext.define('MontessoriCompass.view.photo.Photos', {
    extend: 'Ext.dataview.List',
    xtype: 'photos',
    store: [],
    itemTpl: [
        '<div style="display:inline-block; vertical-align:top;"><img src="{smallHref}"/></div>',
        '<div style="display:inline-block; padding-left: 10px;">{title}<div>({dateTaken})</div></div>'
    ],
    listeners: {
        itemsingletap: 'onPhotoSelected'
    }
});
