/* 
 * This class is responsible for reading messages encoded in an html
 * document.
 */
Ext.define('MontessoriCompass.controller.HtmlMessageReader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.htmlmessage',
    config: {
        totalPages: 1000
    },
    getResponseData: function (response) {
        var self = this;
        
        try {            
            var retVal = {
                total: self.getTotalPages() * 25, 
                success: true,
                messages: []
            };
            var el = document.createElement('div');
            el.innerHTML = response.responseText;

            var msgs = el.getElementsByTagName('li');

            if(msgs.length < 25 && !Ext.isEmpty(response.request.params.page)) {
                // this is the last page
                retVal.total = response.request.params.page * 25;
            }
            
            for (var i = 0; i < msgs.length; i++) {
                var msgEl = msgs[i];

                var shortDate = msgEl.querySelector('.right').lastChild.nodeValue.trim();
                var isNew = msgEl.classList.contains('unread');
                var replyLinkEl = msgEl.querySelector('a.reply');
                var replyLink = replyLinkEl ? replyLinkEl.getAttribute('href') : null;
                var forwardLinkEl = msgEl.querySelector('a.forward');
                var forwardLink = forwardLinkEl ? forwardLinkEl.getAttribute('href') : null;
                var sender = msgEl.querySelector('span.sender').textContent;
                var subjectEl = msgEl.querySelector('span.subject').querySelector('a');
                var msgUrl = subjectEl.getAttribute('href');
                var subject = subjectEl.textContent;
                
                var message = {
                    isNew: isNew,
                    sender: sender.trim(),
                    shortDate: shortDate,
                    replyLink: replyLink,
                    forwardLink: forwardLink,
                    subject: subject.trim(),
                    href: msgUrl
                };

                retVal.messages.push(message);
            }
            
            return retVal;
        } catch (ex) {
            Ext.Logger.warn('Unable to parse the HTML returned by the server');
            return this.createReadError(ex.message);
        }
    }
});

