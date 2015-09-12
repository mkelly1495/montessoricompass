Ext.define('MontessoriCompass.view.activity.ActivityReportsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.activityreports',
    loadActivities: function () {
        var self = this;

        var actStore = self.lookupReference('activities').down('list').getStore();

        // load the messages for the specified page number
        Ext.Ajax.request({
            url: 'https://montessoricompass.com/app/activity_reports',
            disableCaching: false,
            headers: {
                'X-CSRF-Token': self.getViewModel().getAuthToken()
            },
//            cors: true,
//            useDefaultXhrHeader: false,
            success: function (response, opts) {
                // convert the items to Message instances and add to the 
                // message store
                var models = [];

                var el = document.createElement('div');
                el.innerHTML = response.responseText;

                var msgs = el.getElementsByTagName('li');

                for (var i = 0; i < msgs.length; i++) {
                    var msgEl = msgs[i];

                    var isNew = msgEl.classList.contains('unread');
                    var actEl = msgEl.querySelector('a');
                    var title = actEl.textContent;
                    var href = actEl.getAttribute('href');

                    var activity = Ext.create('MontessoriCompass.model.Activity', {
                        isNew: isNew,
                        title: title,
                        href: href
                    });

                    models.push(activity);
                }

                if (!Ext.isEmpty(models)) {
                    actStore.add(models);
                }
            },
            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },
    onActivitySelected: function (self, index, target, record, e, eOpts) {
        var controller = this;

        var activities = this.lookupReference('activities');

        // view selected message
        var activityURL = record.get('href');

        if (!Ext.isEmpty(activityURL)) {
            var actPanel = Ext.create('Ext.Container', {
                title: record.get('title'),
                scrollable: true,
                html: 'Loading Activity...'
            });

            Ext.Ajax.request({
                url: 'https://montessoricompass.com' + activityURL,
                method: 'GET',
                disableCaching: false,
                cors: true,
                useDefaultXhrHeader: false,
                headers: {
                    'X-CSRF-Token': controller.getViewModel().getAuthToken()
                },
                success: function (response, opts) {
                    // need to find the auth token in the response text
                    var el = document.createElement('div');
                    el.innerHTML = response.responseText;

                    var msgBody = el.querySelector('div#body');

                    actPanel.setHtml(msgBody.innerHTML);
                },
                failure: function (response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });

            activities.push(actPanel);
        }
    }


});
