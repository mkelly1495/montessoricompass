Ext.define('MontessoriCompass.view.message.MessagesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.messages',
    requires: [
        'Ext.Ajax',
        'Ext.LoadMask',
        'Ext.MessageBox',
        'Ext.Panel',
        'Ext.layout.VBox',
        'MontessoriCompass.view.message.MessageRecipientSelector',
        'MontessoriCompass.view.message.NewMessage'
    ],
    createNewMessage: function (msgType, msgLink, currRecord) {
        var messages = this.getView();
        var topView = messages.getActiveItem();

        topView.setMasked({
            xtype: 'loadmask',
            message: 'Please Wait...'
        });

        Ext.Ajax.request({
            url: 'https://montessoricompass.com' + msgLink,
            disableCaching: false,
            headers: {
                'X-CSRF-Token': MontessoriCompass.app.getAuthToken()
            },
//            cors: true,
//            useDefaultXhrHeader: false,
            success: function (response, opts) {
                var users = [];
                var selectedUsers = [];

                // convert the items to Message instances and add to the 
                // message store
                var el = document.createElement('div');
                el.innerHTML = response.responseText;

                var form = el.querySelector('form');
                var authToken = form.querySelector('input[name=authenticity_token]').getAttribute('value');
                var optionEls = form.querySelectorAll('select option');

                for (var i = 0; i < optionEls.length; i++) {
                    var optionEl = optionEls[i];

                    var user = Ext.create('MontessoriCompass.model.User', {
                        name: optionEl.textContent.trim(),
                        userId: optionEl.getAttribute('value').trim()
                    });

                    users.push(user);

                    if (optionEl.hasAttribute('selected')) {
                        selectedUsers.push(user);
                    }
                }

                var title = msgType;

                var initData = {
                    authToken: authToken,
                    subject: '',
                    messageBody: null,
                    msgType: msgType,
                    users: users
                };

                if (!Ext.isEmpty(selectedUsers)) {
                    initData.selectedRecipientIds = _.map(selectedUsers, function (user) {
                        return user.get('userId');
                    });
                    initData.selectedRecipientText = _.map(selectedUsers, function (user) {
                        return '[' + user.get('name') + ']';
                    }).join(' ');
                }

                if (msgType === 'Reply') {
                    initData.subject = 'RE: ' + currRecord.subject;
                    initData.origContent = topView.down('container[itemId=msgContent]').getHtml();
                } else if (msgType === 'Forward') {
                    initData.subject = 'FWD: ' + currRecord.subject;
                    initData.origContent = topView.down('container[itemId=msgContent]').getHtml();
                }

                var frmContainer = Ext.create('MontessoriCompass.view.message.NewMessage', {
                    title: title,
                    viewModel: {
                        data: initData
                    }
                });

                topView.setMasked(false);

                messages.push(frmContainer);

            },
            failure: function (response, opts) {
                topView.setMasked(false);
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },
    onReplyMessage: function () {
        var currRec = this.getView().getNavigationBar().getViewModel().get('currRecord');
        var replyLink = currRec.replyLink;

        MontessoriCompass.app.pushHistoryState(
                'newMsg',
                {
                    msgType: 'Reply',
                    msgLink: replyLink,
                    currRecord: currRec
                }, '#replyMsg');

        this.createNewMessage('Reply', replyLink, currRec);
    },
    onDeselectAllRecipients: function () {
        var self = this;

        Ext.Msg.confirm(
                "Confirm Deselect All",
                "Are you sure you wish to deselect all recipients?",
                function (buttonId) {
                    if (buttonId === 'yes') {
                        self.getView().getActiveItem().deselectAll();
                    }
                });
    },
    onRecipientsSelected: function () {
        var messages = this.getView();

        var listView = messages.getActiveItem();

        // update the selected users
        var selectedUsers = listView.down('list').getSelections();
        var formViewModel = listView.newMessageForm.getViewModel();

        formViewModel.set('selectedRecipientIds', _.map(selectedUsers, function (user) {
            return user.get('userId');
        }));

        formViewModel.set('selectedRecipientText', _.map(selectedUsers, function (user) {
            return '[' + user.get('name') + ']';
        }).join(' '));

        history.back();
    },
    onRecipientTextFocus: function (self) {
        var messages = self.up('messages');
        var navBar = messages.getNavigationBar();

        var form = self.up('formpanel');
        var formViewModel = form.getViewModel();
        var users = formViewModel.get('users');
        var selectedIds = formViewModel.get('selectedRecipientIds');

        var selectedRecords = _.filter(users, function (user) {
            return _.contains(selectedIds, user.get('userId'));
        });

        var recipList = Ext.create('MontessoriCompass.view.message.MessageRecipientSelector', {
            title: selectedRecords.length + ' Recipients',
            newMessageForm: form
        });

        var list = recipList.down('list');

        list.getStore().setData(users);
        list.addListener('selectionchange', function (lst, records) {
            navBar.setTitle(lst.getSelectionCount() + ' Recipients');
        });

        list.select(selectedRecords);

        MontessoriCompass.app.pushHistoryState(
                'selectRecipients', {}, '#selectRecipients');

        messages.push(recipList);
    },
    onForwardMessage: function () {
        var currRec = this.getView().getNavigationBar().getViewModel().get('currRecord');

        var forwardLink = currRec.forwardLink;

        MontessoriCompass.app.pushHistoryState(
                'newMsg',
                {
                    msgType: 'Forward',
                    msgLink: forwardLink,
                    currRecord: currRec
                }, '#forwardMsg');

        this.createNewMessage('Forward', forwardLink, currRec);
    },
    onNewMessage: function () {
        var newLink = '/app/messages/sent/new';

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

        this.createNewMessage('New', newLink);
    },
    onRefresh: function () {
        var msgStore = this.lookupReference('messagelist').getStore();

        msgStore.reload();
    },
    onNewMessageSubmit: function (self) {
        var navView = this.getView();

        var messageForm = navView.getActiveItem();

        if (!Ext.isEmpty(messageForm.getViewModel().get('selectedRecipientIds'))) {
            Ext.Msg.confirm(
                    "Confirm Send",
                    "Are you sure you wish to send?",
                    function (buttonId) {
                        if (buttonId === 'yes') {
                            doSubmit();
                        }
                    });

            var doSubmit = function () {
                // if this message was a forward or reply, then we need
                // to append the original content
                var origContent = messageForm.getViewModel().get('origContent');
                var msgType = messageForm.getViewModel().get('msgType');
                var currRecord = navView.getNavigationBar().getViewModel().get('currRecord');

                var msgBody = messageForm.getViewModel().get('messageBody');

                if (!Ext.isEmpty(origContent)) {
                    var sepString = msgType === 'Reply'
                            ? '---------------------------------------'
                            : '---------- Forwarded message ----------';

                    msgBody += "<br/>" + sepString + "<br/>" +
                            'From: ' + currRecord.sender + '<br/>' +
                            'Date: ' + currRecord.date + '<br/>' +
                            'Subject: ' + currRecord.subject + "<br/><br/>" +
                            origContent;
                }

                // set the form value
                messageForm.setValues({
                    'message[body]': msgBody
                });

                messageForm.submit({
                    url: 'https://montessoricompass.com/app/messages/sent',
                    responseType: 'text',
                    success: function (form, result, data) {
                        // indicate if send was successful

                        // pop the form view
                        history.back();
                    },
                    failure: function (options, response, data) {
                        console.log(data);
                    }
                });
            };
        }
    },
    onLogin: function () {
        var list = this.lookupReference('messagelist');

        list.setStore({
            autoLoad: true,
            model: 'MontessoriCompass.model.Message',
            proxy: {
                type: 'ajax',
                url: 'https://montessoricompass.com/app/messages/inbox',
                reader: {
                    type: 'htmlmessage',
                    rootProperty: 'messages'
                },
                headers: {
                    'X-CSRF-Token': MontessoriCompass.app.getAuthToken()
                }
            }
        });

    },
    onBack: function () {
        history.back();
    },
    updateButtonState: function (navView) {
        var navBar = this.getView().getNavigationBar();

        var navBarViewModel = navBar.getViewModel();

        this.lookupReference('backButton').setHidden(true);

        navBarViewModel.set('showBack', false);
        navBarViewModel.set('showLogout', false);
        navBarViewModel.set('newMessage', false);
        navBarViewModel.set('viewingMessage', false);
        navBarViewModel.set('selectingRecipients', false);

        var currView = navView.getActiveItem().getItemId();

        switch (currView) {
            case 'messageViewer':
                navBarViewModel.set('viewingMessage', true);
                navBarViewModel.set('showBack', true);
                break;
            case 'newMessage':
                navBarViewModel.set('newMessage', true);
                navBarViewModel.set('showBack', true);
                break;
            case 'messageRecipientSelector':
                navBarViewModel.set('selectingRecipients', true);
                navBarViewModel.set('showBack', true);
                break;
            default:
                navBarViewModel.set('currRecord', null);
                navBarViewModel.set('showLogout', true);
                break;
        }
    },
    displayMessage: function (recordData, origRecord) {
        var controller = this;

        var messages = controller.getView();
        var activeItem = messages.getActiveItem();
        var navViewModel = messages.getNavigationBar().getViewModel();

        if (!Ext.isEmpty(recordData.href)) {
            activeItem.setMasked({
                xtype: 'loadmask',
                message: 'Please Wait...'
            });

            var msgPanel = Ext.create('Ext.Container', {
                title: 'Message',
                itemId: 'messageViewer',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        html: 'From: <i>' + recordData.sender + '</i>'
                    },
                    {
                        html: 'Date: ',
                        itemId: 'msgDate'
                    },
                    {
                        html: 'Subject: ' + recordData.subject
                    },
                    {
                        html: '<br/>'
                    },
                    {
                        xtype: 'container',
                        scrollable: true,
                        flex: 1,
                        itemId: 'msgContent'
                    }
                ]
            });

            Ext.Ajax.request({
                url: 'https://montessoricompass.com' + recordData.href,
                method: 'GET',
                disableCaching: false,
                cors: true,
                useDefaultXhrHeader: false,
                headers: {
                    'X-CSRF-Token': MontessoriCompass.app.getAuthToken()
                },
                success: function (response, opts) {
                    // need to find the auth token in the response text
                    var el = document.createElement('div');
                    el.innerHTML = response.responseText;

                    var msgBody = el.querySelector('div#body');
                    var msgDate = el.querySelector('div.column1of4 div.clearfix span.right').textContent.trim();

                    if (!Ext.isEmpty(origRecord)) {
                        origRecord.set('isNew', false);
                        origRecord.set('date', msgDate);
                        navViewModel.set('currRecord', origRecord.getData());
                    } else {
                        navViewModel.set('currRecord', recordData);
                    }

                    msgPanel.down('container[itemId=msgDate]').setHtml('Date: ' + msgDate);
                    msgPanel.down('container[itemId=msgContent]').setHtml(msgBody.innerHTML);

                    activeItem.setMasked(false);
                    
                    messages.push(msgPanel);
                },
                failure: function (response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });
        }

    },
    onMessageSelected: function (self, index, target, record, e, eOpts) {
        // replace the current state with a beforeReadMsg so the
        // navpanel will get popped on back
        history.replaceState({
            action: 'beforeReadMsg',
            args: {}
        }, null, '#messages');

        MontessoriCompass.app.pushHistoryState(
                'readMessage',
                {
                    record: record.getData()
                }, '#readMessage');

        this.displayMessage(record.getData(), record);
    },
    onLogout: function () {
        MontessoriCompass.app.logout();
    }
});
