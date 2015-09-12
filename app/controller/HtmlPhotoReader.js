/* 
 * This class is responsible for reading messages encoded in an html
 * document.
 */
Ext.define('MontessoriCompass.controller.HtmlPhotoReader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.htmlphoto',
    getResponseData: function (response) {
        try {
            var retVal = {
                success: true,
                photos: []
            };

            var el = document.createElement('div');
            el.innerHTML = response.responseText;

            var albumEl = el.querySelector('div.photoalbum');

            var photosNodeList = albumEl.querySelectorAll('div.photo:not(.photo-fake)');

            for (var i = 0; i < photosNodeList.length; i++) {
                var photoEl = photosNodeList[i];

                try {
                    var smallImgEl = photoEl.querySelector('img.fit-to-grid');
                    
                    var smallHref = smallImgEl.getAttribute('src');
                    var title = smallImgEl.getAttribute('alt');
                    var dateTaken = photoEl.querySelector('p.photo_created span').textContent;
                    var href = photoEl.querySelector('a').getAttribute('href');

                    var album = {
                        title: title,
                        smallHref: smallHref,
                        href: href,
                        dateTaken: dateTaken
                    };

                    retVal.photos.push(album);
                } catch (ex) {
                    console.log(ex.message);
                }
            }

            return retVal;
        } catch (ex) {
            Ext.Logger.warn('Unable to parse the HTML returned by the server');
            return this.createReadError(ex.message);
        }
    }
});

