(function ($) {
    let userViewId = $('#userViewId')[0].innerText,
        userId = $('#userId')[0].innerText,
        followUnfolowBtn = $('#followUnfollowBtn')

    if (userViewId == userId) {
        window.location.href = "/user"
    }
    $.ajax({
        url: `/user/following/${userId}`,
        type: 'GET',
        success: (data) => {
            if (data.indexOf(userViewId) != -1) {
                followUnfolowBtn[0].innerText = "Unfollow"
            } else {
                followUnfolowBtn[0].innerText = "Follow"
            }
        },
        error: function (err) {
            console.log(err);
        }
    })


    followUnfolowBtn.click(() => {
        if (followUnfolowBtn[0].innerText == "Follow") {
            $.ajax({
                url: `/user/following/${userViewId}`,
                type: 'POST',
                success: (data) => {
                    window.location.reload()
                },
                error: function (err) {
                    console.error(err.responseJSON.error);
                }
            })
        } else {
            $.ajax({
                url: `/user/following/${userViewId}`,
                type: 'DELETE',
                success: (data) => {
                    window.location.reload()
                },
                error: function (err) {
                    console.error(err.responseJSON.error);
                }
            })
        }
    })

    
}(window.jQuery))