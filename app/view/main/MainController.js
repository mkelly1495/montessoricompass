/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MontessoriCompass.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    requires: [
        'MontessoriCompass.view.login.Login',
        'MontessoriCompass.view.message.Messages',
        'MontessoriCompass.view.directory.Directory',
        'MontessoriCompass.view.photo.PhotoAlbums'
    ],
    config: {
        control: {
            'textfield': {
                focus: 'onTextFieldFocus',
                blur: 'onTextFieldBlur'
            }
        }
    },
    onTextFieldFocus: function (self) {
        this.lookupReference('tabview').getTabBar().setHidden(true);
    },
    onTextFieldBlur: function (self) {
        this.lookupReference('tabview').getTabBar().setHidden(false);
    },
    populateContent: function () {
        this.lookupReference('messages').getController().onLogin(); // load first page
        this.lookupReference('photoalbums').getController().onLogin();
        this.lookupReference('directory').getController().onLogin();
    },
    loginSuccessful: function (initContent) {
        this.getView().setActiveItem(1);

        if (initContent) {
            this.populateContent();
        }

        MontessoriCompass.app.pushHistoryState(
                'tabChange', {value: 0}, '#messages');
    },
    showLoginView: function () {
        var self = this;

        self.getView().setActiveItem(0);

        MontessoriCompass.app.pushHistoryState(
                'login', {}, '#login');
    },
    tabChanged: function (self, value, oldValue, eOpts) {
        // only track tab change history on android.
        if (Ext.os.is.Android) {
            var tabTitles = ['Messages', 'Photos', 'Directory'];

            var newTabIndex = tabTitles.indexOf(value.title);

            MontessoriCompass.app.pushHistoryState(
                    "tabChange", {value: newTabIndex}, '#' + value.title.toLowerCase());
        }
    }
});
