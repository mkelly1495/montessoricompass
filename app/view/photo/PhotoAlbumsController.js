Ext.define('MontessoriCompass.view.photo.PhotoAlbumsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.photoalbums',
    requires: [
        'Ext.Img',
        'Ext.layout.Fit',
        'MontessoriCompass.view.photo.Photos'
    ],
    onLogin: function () {
        this.lookupReference('albumslist').setStore({
            model: 'MontessoriCompass.model.PhotoAlbum',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'https://montessoricompass.com/app/image_gallery/albums',
                reader: {
                    type: 'htmlphotoalbum',
                    rootProperty: 'photoalbums'
                },
                headers: {
                    'X-CSRF-Token': MontessoriCompass.app.getAuthToken()
                }
            }
        });
    },
    onShareImage: function () {
        if (window.plugins && window.plugins.socialsharing) {
            var imgPanel = this.getView().getActiveItem();
            var img = imgPanel.down('img');
            
            var title = imgPanel.config.record.get('title');
            var imgUrl = imgPanel.config.record.get('href');

            img.setHtml('<i style="color: #157FCC;font-size: 50px;" class="fa fa-spinner fa-spin"></i>');

            // hide the mask when share operation completed.
            var callback = function (wasShared) {
                img.setHtml(null);
            };

            try {
                window.plugins.socialsharing.share(
                        title,
                        null,
                        imgUrl,
                        null,
                        callback,
                        callback);
            } catch (e) {
                img.setHtml(null);
                console.log(e.message);
            }
        }
    },
    onPhotoSelected: function (self, index, target, record, e, eOpts) {
        var photoalbums = this.getView();

        var photoURL = record.get('href');

        if (!Ext.isEmpty(photoURL)) {
            var photoPanel = Ext.create('Ext.Container', {
                title: record.get('title'),
                layout: 'fit',
                itemId: 'photoView',
                record: record,
                items: [
                    {
                        xtype: 'img',
                        style: 'background-size: 100% 100% !important;',
                        src: photoURL
                    }
                ]
            });

            photoalbums.push(photoPanel);

            MontessoriCompass.app.pushHistoryState(
                    'photoSelected', {}, '#photo');
        }
    },
    onBack: function () {
        history.back();
    },
    updateButtonState: function (navView) {
        var navBarViewModel = this.getView().getNavigationBar().getViewModel();

        this.lookupReference('backButton').setHidden(true);

        navBarViewModel.set('showBack', false);
        navBarViewModel.set('showShare', false);

        if (navView.getActiveItem().getItemId() !== 'albumslist') {
            navBarViewModel.set('showBack', true);

            if (navView.getActiveItem().getItemId() === 'photoView') {
                navBarViewModel.set('showShare', true);
            }
        }
    },
    onPhotoAlbumSelected: function (self, index, target, record, e, eOpts) {
        var controller = this;

        var photoalbums = this.getView();

        // view selected message
        var albumURL = record.get('href');

        if (!Ext.isEmpty(albumURL)) {
            var photoList = Ext.create('MontessoriCompass.view.photo.Photos');

            var photosPanel = Ext.create('Ext.Container', {
                title: record.get('title'),
                layout: 'fit',
                items: [photoList]
            });

            photoList.setStore({
                model: 'MontessoriCompass.model.Photo',
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: 'https://montessoricompass.com' + albumURL,
                    reader: {
                        type: 'htmlphoto',
                        rootProperty: 'photos'
                    },
                    headers: {
                        'X-CSRF-Token': MontessoriCompass.app.getAuthToken()
                    }
                }
            });

            photoalbums.push(photosPanel);

            // replace the current state with a beforePhotoAlbumSelected so the
            // navpanel will get popped on back
            history.replaceState({
                action: 'beforePhotoAlbumSelected',
                args: {}
            }, null, '#photos');

            MontessoriCompass.app.pushHistoryState(
                    'photoAlbumSelected', {}, '#photoalbum');
        }
    }
});
