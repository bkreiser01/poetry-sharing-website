(function ($) {
    let current_tagId = $('#current-tagid')[0].innerText,
        tagList = $('#tag-list')

    $.ajax({
        url: `/tags/info/${current_tagId}`,
        type: 'GET',
        success: function (tag) {
            for (let i = 0 ; i < tag.taggedPoemsId.length; i++) {
                $.ajax({
                    url: `/poems/getPoemById/${tag.taggedPoemsId[i]}`,
                    type: 'GET',
                    success: function (poem) {
                        let timesTagged = 0
                        for (let j = 0; j < poem.submittedTags.length; j++) {
                            if (poem.submittedTags[j].tagId == current_tagId) {
                                timesTagged = poem.submittedTags[j].tagCount
                            }
                        }   
                        tagList.append(`<li><a href="/poems/${poem._id}">${poem.title}</a> - ${timesTagged}</li>`)
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
}(window.jQuery))