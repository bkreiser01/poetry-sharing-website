(function ($) {
    let favTagsList = $('#fav-tags'),
        globalTagsList = $('#global-fav-tags'),
        follower_count = $('#follower_count')[0],
        following_count = $('#following_count')[0],
        userId = $('#userId')[0].innerText,
        ViewedUserId = $('#userViewId')[0].innerText;

    

    $.ajax({
        url: `/user/followers/${userId}`,
        type: 'GET',
        success: function (followers) {
            follower_count.innerText = followers.length
        },
        error: function (e) {
            console.error(e);
        }
    });

    $.ajax({
        url: `/user/following/${userId}`,
        type: 'GET',
        success: function (following) {
            following_count.innerText = following.length
        },
        error: function (e) {
            console.error(e);
        }
    });

    $.ajax({
        url: `/tags/popular`,
        type: 'GET',
        success: function (tags) {
            for (let i=0; i<tags.length; i++) { 
                globalTagsList.append(`<li><a href="/tags/${tags[i]._id}">${tags[i].tagString}</a></li>`)
            }
        },
        error: function (e) {
            console.error(e);
        }
    });

    $.ajax({
        url: `/user/${ViewedUserId}/favorite-tags`,
        type: 'GET',
        success: function (tags) {
            for (let i=0; i<tags.length; i++) { 
                $.ajax({
                    url: `/tags/info/${tags[i]}`,
                    type: 'GET',
                    success: function (tag) {
                        favTagsList.append(`<li><a href="/tags/${tag._id}">${tag.tagString}</a></li>`)
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