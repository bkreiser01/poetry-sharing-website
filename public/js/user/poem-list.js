(function ($) {
    let userId = $('#userId')[0].innerText,
        method = $('#method_name')[0].innerText,
        poems_list = $('#poems_list')

    $.ajax({
        url: `/user/${method}/${userId}`,
        type: 'GET',
        success: function (users) {
            for (let i=0; i<users.length; i++) { 
                $.ajax({
                    url: `/poems/getPoemById/${users[i]}`,
                    type: 'GET',
                    success: function (poem) {
                        poems_list.append(`<li><a href="/poems/${poem._id}">${poem.title}</a></li>`)
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