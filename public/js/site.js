(function ($) {
    let login_logout_option = $('#nav5')

    // Check if the user is logged in
    $.ajax({
        url: '/check-authentication',
        type: 'GET',
        success: function (data) {
            // Change option depending on if the user is logged in or not
            if (data.authenticated) {
                login_logout_option.html('<a href="/logout">Logout</a>')
            } else {
                login_logout_option.html('<a href="/login">Login</a>')
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}(window.jQuery))