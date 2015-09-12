
Ext.define("MontessoriCompass.view.login.Login", {
    extend: 'Ext.form.Panel',
    xtype: 'login',
    requires: [
        "MontessoriCompass.view.login.LoginController",
        "MontessoriCompass.view.login.LoginModel",
        'Ext.Button',
        'Ext.Img',
        'Ext.field.Toggle',
        'Ext.field.Email',
        'Ext.field.Hidden',
        'Ext.field.Password',
        'Ext.form.FieldSet'
    ],
    controller: "login",
    viewModel: {
        type: "login"
    },
    scrollable: true,
    items: [
        {
            xtype: 'img',
            src: 'resources/images/appIcon.png',
            height: '8em'
        },
        {
            html: '<br/>'
        },
        {
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'emailfield',
                    id: 'user_email',
                    label: 'Email',
                    labelAlign: 'top',
                    name: 'user[email]',
                    bind: {
                        value: '{email}'
                    }
                },
                {
                    xtype: 'hiddenfield',
                    name: 'authenticity_token',
                    bind: {
                        value: '{loginAuthToken}'
                    }
                },
                {
                    xtype: 'hiddenfield',
                    name: 'user[remember_me]',
                    value: "0"
                }
            ]
        },
        {
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'passwordfield',
                    id: 'user_password',
                    label: 'Password',
                    labelAlign: 'top',
                    name: 'user[password]',
                    bind: {
                        value: '{password}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'togglefield',
                    label: 'Remember Me',
                    labelWidth: '70%',
                    name: 'rememberMe',
                    bind: {
                        value: '{rememberMe}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'button',
                    text: 'Login',
                    handler: 'onLoginSubmit'
                }
            ]
        },
        {
            html: '<h3 style="text-align: center;font-weight: bold;color: red;">Login Failed</h3>',
            bind: {
                hidden: '{!invalidLoginHappened}'
            }
        }
    ],
    listeners: {
        initialize: 'onLoginFormInit'
    }
});
