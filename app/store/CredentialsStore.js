/* 
 * This class provides a store for previously entered credentials.
 */
Ext.define('MontessoriCompass.store.CredentialsStore', {
    extend: 'Ext.data.Store',
    requires: [
        'MontessoriCompass.model.Credentials'
    ],
    storeId: 'CredentialsStore',
    model: 'MontessoriCompass.model.Credentials',
    proxy: {
        type: 'localstorage',
        id: 'user-credentials'
    }
});

