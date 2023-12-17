(function ($) {
    let favTagsList = $('#fav_tags_list'),
        globalTagsList = $('#global_tags_list')
    
    $.ajax({
        url: `/tags/popular`,
        type: 'GET',
        success: function (tags) {
            for (let i=0; i<tags.length; i++) { 
                favTagsList.append(`<li><a>${tags[i].tagString}</a></li>`)
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}(window.jQuery))