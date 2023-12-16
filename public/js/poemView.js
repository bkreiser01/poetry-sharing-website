//Handle tag, save, and like functionality on poem view page

import validation from './validation.js';

(function($) {
    let TagForm = $('#addTagForm');
    let LikeButton = $('#LikeIt');
    let SaveButton = $('#SaveIt');


    
    TagForm.on('submit', function(event) {
        event.preventDefault();
        console.log("Submitted");

        //Get data
        let pathName = $(location).attr('pathname');
        pathName = pathName.substring(7);
        let data = {
            tagString: $('#TagString').val(),
            taggedPoemId: pathName
        }

        //AJAX call to update tag data
        $.ajax({
            url: '/AddTagToPoem',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(data) {
            },
            error: function(e) {
                console.error(e.responseJSON);
                error.text(e.responseJSON);
            },
        });

        //Update Users taggedPoems
        
        //Update Poems submittedTags
        
    });



    SaveButton.on('click', function (event) {
        console.log("Saved");
    });



    LikeButton.click(function (event) {
        console.log("Liked");
    });

})(window.jQuery)