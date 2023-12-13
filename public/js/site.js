(function ($) {
    let login_logout_option = $('#login-logout'),
        user_account = $('#user-account');

    // Check if the user is logged in
    $.ajax({
        url: '/check-authentication',
        type: 'GET',
        success: function (data) {
            // Change option depending on if the user is logged in or not
            if (data.authenticated) {
                login_logout_option.html('<a href="/logout">Logout</a>')
                user_account.html('<a href="/user">User account</a>')
            } else {
                login_logout_option.html('<a href="/login">Login</a>')
                user_account.html('<a href="/register">Register</a>')
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}(window.jQuery))