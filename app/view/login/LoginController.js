Ext.define('MontessoriCompass.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',
    requires: [
        'Ext.Ajax'
    ],
    onLogout: function () {
        var controller = this;

        // request the montessori compass login page so we can get the
        // authenticity token
        Ext.Ajax.request({
            url: 'https://montessoricompass.com/app/signout',
            method: 'DELETE',
            disableCaching: false,
            cors: true,
            useDefaultXhrHeader: false,
            params: {
                authenticity_token: MontessoriCompass.app.getAuthToken()
            },
            success: function (response, opts) {
                MontessoriCompass.app.setAuthToken(null);

                controller.getViewModel().set('loggedOut', true);
                controller.onLoginFormInit();
                MontessoriCompass.app.getMainController().showLoginView();

            },
            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },
    onLoginSubmit: function () {
        var self = this;

        var loginForm = this.getView();
        var viewModel = this.getViewModel();

        loginForm.setMasked({
            xtype: 'loadmask',
            message: 'Please Wait...'
        });
        
        var credStore = Ext.getStore('CredentialsStore');
        var rememberMe = viewModel.get('rememberMe');
        
        if (rememberMe) {
            var email = viewModel.get('email');
            var password = viewModel.get('password');

            if (credStore.count() === 0
                    || credStore.getAt(0).get('email') !== email
                    || credStore.getAt(0).get('password') !== password) {
                credStore.removeAll();

                credStore.add(Ext.create('MontessoriCompass.model.Credentials', {
                    email: email,
                    password: password
                }));
            }
        } else {
            credStore.removeAll();
        }

        // sync the cred store to save data
        credStore.sync();

        loginForm.submit({
            url: 'https://montessoricompass.com/app/signin',
            responseType: 'text',
            callback: function() {
                loginForm.setMasked(false);                
            },
            success: function (form, result, data) {
                var authToken = self.extractToken(data);
                MontessoriCompass.app.setAuthToken(authToken);

                self.getViewModel().set('invalidLoginHappened', false);

                // update loggedOut state
                self.getViewModel().set('loggedOut', false);

                MontessoriCompass.app.getMainController().loginSuccessful(true);
                
                // clear the credential fields if remember me was not selected
                if(!rememberMe) {
                    viewModel.set('email', null);
                    viewModel.set('password', null);
                }                
            },
            failure: function (options, response, data) {
                console.log(data);
                self.getViewModel().set('invalidLoginHappened', true);
            }
        });
    },
    onLoginFormInit: function (self) {
        var controller = this;

        this.getViewModel().set('loginAuthToken', null);

        // request the montessori compass login page so we can get the
        // authenticity token
        Ext.Ajax.request({
            url: 'https://montessoricompass.com/app/signin?iframe_redirect=1',
            method: 'GET',
            disableCaching: false,
            cors: true,
            useDefaultXhrHeader: false,
            success: function (response, opts) {

                // need to find the auth token in the response text
                // and store it for use when login is submitted
                controller.getViewModel().set('loginAuthToken', controller.extractToken(response.responseText));
            },
            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });

        var credStore = Ext.getStore('CredentialsStore');

        credStore.load({
            callback: function () {
                if (credStore.count() > 0) {
                    var cred = credStore.getAt(0);

                    controller.getViewModel().set('email', cred.get('email'));
                    controller.getViewModel().set('password', cred.get('password'));
                    controller.getViewModel().set('rememberMe', true);
                }
            }
        });
    },
    extractToken: function (htmlString) {
        var matches = (/\<meta content\=\"([^\"]+)\" name\=\"csrf-token\" \/\>/).exec(htmlString);
        return !Ext.isEmpty(matches) ? matches[1] : null;
    }
});
