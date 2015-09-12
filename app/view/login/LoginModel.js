Ext.define('MontessoriCompass.view.login.LoginModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.login',
    data: {
        loginAuthToken: null,
        loggedOut: true,
        invalidLoginHappened: false,
        email: null,
        password: null,
        rememberMe: false
    }

});
