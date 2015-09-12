/* 
 * This class is responsible for reading messages encoded in an html
 * document.
 */
Ext.define('MontessoriCompass.controller.HtmlUserReader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.htmluser',
    getResponseData: function (response) {
        try {
            var retVal = {
                success: true,
                users: []
            };

            var el = document.createElement('div');
            el.innerHTML = response.responseText;

            var userEls = el.querySelectorAll('li');

            for (var i = 0; i < userEls.length; i++) {
                var userEl = userEls[i];
                var dataEls = userEl.querySelectorAll('div.column1of3');

                var childName = dataEls[0].lastChild.textContent.trim();
                var parentNames = dataEls[1].textContent.trim();
                var sendMessageHref = dataEls[2].querySelector('span a').getAttribute('href');

                var user = {
                    childName: childName,
                    parentNames: parentNames,
                    sendMessageHref: sendMessageHref
                };

                retVal.users.push(user);
            }

            return retVal;
        } catch (ex) {
            Ext.Logger.warn('Unable to parse the HTML returned by the server');
            return this.createReadError(ex.message);
        }
    }
});

