//Handle tag, save, and like functionality on poem view page
import validation from '/public/js/validation.js';

(function($) {
    let TagForm = $('#addTagForm'),
        likeBtn = $('#likeBtn'),
        userId = $('#userId')[0].innerText,
        poemId_ = $('#poemId_')[0].innerText,
        tagString = $('#TagString'),
        error = $('#error-tag')

    $.ajax({
        url: `/user/getLikedPoems/${userId}`,
        method: 'GET',
        success: function(data) {
            if (data.indexOf(poemId_) == -1) {
                likeBtn.text("Like")
            } else {
                likeBtn.text("Unlike")
            }
        },
        error: function(e) {
            console.error(e.responseJSON.error);
        },
    });
    
    TagForm.on('submit', function(event) {
        event.preventDefault();
        error.text('')
        let uid = validation.checkString(tagString.val(), "tag")

        $.ajax({
            url: `/user/addTagToPoem/${userId}/${uid}/${poemId_}`,
            method: 'POST',
            success: function(data) {
                console.log(data)
            },
            error: function(e) {
                console.error(e.responseJSON.error);
                error.text(e.responseJSON.error)
            },
        });
    });



    likeBtn.on('click', function (event) {
        event.preventDefault();
        let method = 'DELETE';
        if (likeBtn.text() == "Like") {
            method = 'POST';
        }
        
        $.ajax({
            url: `/user/favorite/${poemId_}`,
            method: `${method}`,
            contentType: 'application/json',
            success: function(data) {
                if (method == 'POST') {
                    likeBtn.text("Unlike")
                } else {    
                    likeBtn.text("Like")
                }
            },
            error: function(e) {
                console.error(e);
            },
        });
    });

})(window.jQuery)