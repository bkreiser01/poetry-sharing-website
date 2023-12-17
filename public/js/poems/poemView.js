//Handle tag, save, and like functionality on poem view page
(function($) {
    let TagForm = $('#addTagForm'),
        likeBtn = $('#likeBtn'),
        userId = $('#userId')[0].innerText,
        poemId_ = $('#poemId_')[0].innerText

    $.ajax({
        url: `/user/getLikedPoems/${userId}`,
        method: 'GET',
        success: function(data) {
            console.log(data)
            console.log(poemId_)

            if (data.indexOf(poemId_) == -1) {
                likeBtn.text("Like")
            } else {
                likeBtn.text("Unlike")
            }
        },
        error: function(e) {
            console.error(e.responseJSON);
        },
    });
    
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
            url: '/addTagToPoem',
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