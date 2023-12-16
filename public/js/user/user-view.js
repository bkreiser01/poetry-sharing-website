(function ($) {
    let userViewId = $('#userViewId')[0].innerText,
        userId = $('#userId')[0].innerText,
        followUnfolowBtn = $('#followUnfollowBtn')

    followUnfolowBtn[0].innerText = "Follow"
    console.log(userId)
    $.ajax({
        url: `/user/following/${userId}`,
        type: 'GET',
        success: (data) => {
            if (data.indexOf(userViewId) != -1) {
                followUnfolowBtn[0].innerText = "Unfollow"
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
                    followUnfolowBtn[0].innerText = "Unfollow"
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
                    followUnfolowBtn[0].innerText = "Follow"
                },
                error: function (err) {
                    console.error(err.responseJSON.error);
                }
            })
        }
    })

    
}(window.jQuery))