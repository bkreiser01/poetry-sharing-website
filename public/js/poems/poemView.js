//Handle tag, save, and like functionality on poem view page
import validation from '/public/js/validation.js';

(function($) {
    let TagForm = $('#addTagForm'),
        likeBtn = $('#likeBtn'),
        userId = $('#userId')[0].innerText,
        poemId_ = $('#poemId_')[0].innerText,
        tagString = $('#TagString'),
        showTagsBtn = $('#showTagsBtn'),
        globalTags = $('#global-tags'),
        userTags = $('#user-tags'),
        tag_view = $('#tag-view'),
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
                //console.log(data);
                location.reload();
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

    showTagsBtn.on('click', function (event) {
        event.preventDefault();
        if (showTagsBtn.text() == "Show Tags") {
            tag_view.show()

            // Get global tags
            $.ajax({
                url: `/poems/getPoemById/${poemId_}`,
                type: 'GET',
                success: function (poem) {
                    for (let i = 0; i < poem.submittedTags.length; i++) {
                        let tagId = poem.submittedTags[i].tagId;
                        $.ajax({
                            url: `/tags/info/${tagId}`,
                            type: 'GET',
                            success: function (tag) {
                                globalTags.append(`<li><a href="/tags/${tag._id}">${tag.tagString}</a></li>`)
                            },
                            error: function (e) {
                                console.error(e);
                            }
                        });
                    }
                },
                error: function (e) {
                    console.error(e);
                }
            });

            // Get user tags
            $.ajax({
                url: `/user/getTaggedPoems/${userId}`,
                type: 'GET',
                success: function (taggedPoems) {
                    let poemTagged
                    for (let i = 0; i < taggedPoems.length; i++) {
                        if (taggedPoems[i].poemId == poemId_) {
                            poemTagged = taggedPoems[i]
                        }
                    }
                    if (!poemTagged) {
                        userTags.append(`<li>No tags yet. Add one!</li>`)
                    } else {
                        //console.log(poemTagged)
                        for (let i = 0; i < poemTagged.tagIds.length; i++) {
                            $.ajax({
                                url: `/tags/info/${poemTagged.tagIds[i]}`,
                                type: 'GET',
                                success: function (tag) {
                                    userTags.append(`<li><a href="/tags/${tag._id}">${tag.tagString}</a></li>`)
                                },
                                error: function (e) {
                                    console.error(e);
                                }
                            });
                        }
                    }
                },
                error: function (e) {
                    console.error(e);
                }
            });

            showTagsBtn.text("Hide Tags")
        } else {
            tag_view.hide()
            globalTags.empty()
            userTags.empty()
            showTagsBtn.text("Show Tags")
        }
    })

})(window.jQuery)