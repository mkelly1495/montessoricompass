Ext.define('MontessoriCompass.view.directory.DirectoryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.directory',
    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.tab.Panel'
    ],
    onLogin: function () {
        this.lookupReference('directoryList').setStore({
            model: 'MontessoriCompass.model.DirectoryEntry',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'https://montessoricompass.com/app/students/directory',
                reader: {
                    type: 'htmluser',
                    rootProperty: 'users'
                },
                headers: {
                    'X-CSRF-Token': MontessoriCompass.app.getAuthToken()
                }
            },
            sorterFn: 'childName',
            grouper: {
                groupFn: function (record) {
                    return record.get('childName')[0].toUpperCase();
                }
            }
        });
    },
    onUserSelected: function (self, index, target, record, e, eOpts) {
        var newLink = '/app/messages/sent/new';
        
        var tabPanel = this.getView().up('tabpanel');

        tabPanel.setActiveItem(0);

        var messages = tabPanel.getAt(0).down('messages');

        // replace the current state with a beforeReadMsg so the
        // navpanel will get popped on back
        history.replaceState({
            action: 'beforeNewMsg',
            args: {}
        }, null, '#messages');

        MontessoriCompass.app.pushHistoryState(
                'newMsg',
                {
                    msgType: 'New',
                    msgLink: newLink
                }, '#newMsg');
                
        messages.getController().createNewMessage('New', record.get('sendMessageHref'));
    }
});
