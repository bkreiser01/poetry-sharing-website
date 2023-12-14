(function ($) {
    let userId = $('#userId')[0].innerText,
        method = $('#method_name')[0].innerText,
        user_list = $('#user_list')

    $.ajax({
        url: `/user/${method}/${userId}`,
        type: 'GET',
        success: function (users) {
            for (let i=0; i<users.length; i++) { 
                $.ajax({
                    url: `/user/searchById/${users[i]}`,
                    type: 'GET',
                    success: function (user) {
                        user_list.append(`<li><a href="/user/${user._id}">${user.username}</a></li>`)
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}(window.jQuery))