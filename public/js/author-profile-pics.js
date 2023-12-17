(function ($) {
    let authours = $('.author-picture')

    for (let i = 0; i < authours.length; i++) {
        let authorName = authours[i].id;
        $.ajax({
            url: `/user/getProfilePic/${authorName}`,
            type: 'GET',
            success: function (profilePic) {
                authours[i].src = profilePic.profile_pic_link;
            },
            error: function (err) {
                console.error(err);
            }
        })
    }
}(window.jQuery))