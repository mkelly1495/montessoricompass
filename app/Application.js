/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('MontessoriCompass.Application', {
    extend: 'Ext.app.Application',
    name: 'MontessoriCompass',
    requires: [
        'Ext.Ajax',
        'Ext.Button',
        'Ext.Container',
        'Ext.Img',
        'Ext.TitleBar',
        'Ext.app.ViewController',
        'Ext.app.ViewModel',
        'Ext.data.Model',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json',
        'Ext.dataview.List',
        'Ext.field.Email',
        'Ext.field.Hidden',
        'Ext.field.Password',
        'Ext.field.Search',
        'Ext.field.Toggle',
        'Ext.field.TextArea',
        'Ext.field.Text',
        'Ext.form.FieldSet',
        'Ext.form.Panel',
        'Ext.layout.Card',
        'Ext.layout.Fit',
        'Ext.navigation.View',
        'Ext.os',
        'Ext.tab.Panel',
        'Ext.layout.HBox',
        'Ext.layout.VBox',
        'Ext.Panel',
        'Ext.LoadMask',
        'Ext.MessageBox',
        'Ext.Toolbar',
        'MontessoriCompass.view.message.MessageRecipientSelector',
        'MontessoriCompass.view.message.NewMessage',
        'MontessoriCompass.view.photo.Photos',
        'MontessoriCompass.controller.HtmlMessageReader',
        'MontessoriCompass.controller.HtmlPhotoAlbumReader',
        'MontessoriCompass.controller.HtmlPhotoReader',
        'MontessoriCompass.controller.HtmlUserReader'
    ],
    config: {
        authToken: null,
        refs: {
            mainView: 'app-main'
        }
    },
    controllers: [
    ],
    models: [
        'MontessoriCompass.model.Message',
        'MontessoriCompass.model.Activity',
        'MontessoriCompass.model.Photo',
        'MontessoriCompass.model.PhotoAlbum',
        'MontessoriCompass.model.User',
        'MontessoriCompass.model.DirectoryEntry',
        'MontessoriCompass.model.Credentials'
    ],
    stores: [
        'MontessoriCompass.store.CredentialsStore'
    ],
    views: [
//        'activity.ActivityReports',
//        'progress.ProgressReports',
        'directory.Directory',
        'login.Login',
        'main.Main',
        'message.Messages',
        'photo.PhotoAlbums'
    ],
    init: function (app) {
        document.addEventListener('deviceready', function (e) {
            // hide the splash screen
            if (navigator.splashscreen) {
                try {
                    navigator.splashscreen.hide();
                } catch (ex) {
                    console.log(ex.message);
                }
            }
        });
    },
    launch: function () {
        // TODO - Launch the application
        var self = this;

        window.addEventListener('popstate', function (e) {
            var state = e.state;

            if (!(Ext.isEmpty(state) || Ext.isEmpty(state.action))) {
                self.doAction(state.action, state.args);
            }
        });

        self.pushHistoryState('login', {}, '#login');
    },
    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
                function (choice) {
                    if (choice === 'yes') {
                        window.location.reload();
                    }
                }
        );
    },
    getMainController: function () {
        return this.getMainView().getController();
    },
    logout: function () {
        var loginController = this.getMainView().down('login').getController();
        loginController.onLogout();
    },
    pushHistoryState: function (action, args, hash) {
        if (Ext.isEmpty(history.state)
                || history.state.action !== action
                || window.location.hash !== hash) {
            history.pushState({
                action: action,
                args: args
            }, null, hash);
        }
    },
    doAction: function (actionName, argsObj) {
        var self = this;

        switch (actionName) {
            case 'tabChange':
                self.getMainView().setActiveItem(1);
                self.getMainView().down('tabpanel').setActiveItem(argsObj.value);
                break;
            case 'login':
                self.getMainController().showLoginView();
                break;
            case 'main':
                self.getMainController().loginSuccessful(false);
                break;
            case 'beforeReadMsg':
            case 'beforeNewMsg':
            case 'readMessage':
//                self.getMainView().down('messages').displayMessage(argsObj.record);
//                break;
            case 'newMsg':
//                self.getMainView().down('messages').createNewMessage(
//                        argsObj.msgType,
//                        argsObj.msgLink,
//                        argsObj.currRecord);
//                break;
            case 'selectRecipients':
                var messages = self.getMainView().down('messages');
                self.getMainView().setActiveItem(1);
                self.getMainView().down('tabpanel').setActiveItem(0);
                messages.pop();
                messages.lookupReference('backButton').setHidden(true);
                break;
            case 'beforePhotoAlbumSelected':
            case 'photoAlbumSelected':
            case 'photoSelected':
                var photos = self.getMainView().down('photoalbums');
                self.getMainView().setActiveItem(1);
                self.getMainView().down('tabpanel').setActiveItem(1);
                photos.pop();
                photos.lookupReference('backButton').setHidden(true);
                break;
        }
    }

});
