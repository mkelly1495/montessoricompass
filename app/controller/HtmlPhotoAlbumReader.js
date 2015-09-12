/* 
 * This class is responsible for reading messages encoded in an html
 * document.
 */
Ext.define('MontessoriCompass.controller.HtmlPhotoAlbumReader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.htmlphotoalbum',
    getResponseData: function (response) {
        try {
            var retVal = {
                success: true,
                photoalbums: []
            };

            var el = document.createElement('div');
            el.innerHTML = response.responseText;

            var albumEls = el.querySelectorAll('div.album-block');

            for (var i = 0; i < albumEls.length; i++) {
                var albumEl = albumEls[i];
                var coverImgHref = albumEl.querySelector('div.image-wrapper a img').getAttribute('src');

                var albumLinkEl = albumEl.querySelector('div.title a');
                var title = albumLinkEl.textContent;
                var href = albumLinkEl.getAttribute('href');

                var album = {
                    title: title,
                    coverHref: coverImgHref,
                    href: href
                };

                retVal.photoalbums.push(album);
            }

            return retVal;
        } catch (ex) {
            Ext.Logger.warn('Unable to parse the HTML returned by the server');
            return this.createReadError(ex.message);
        }
    }
});

