import validation from './validation.js';

(function($) {
    let loginForm = $('#login_form'),
        username = $('#username_input'),
        password = $('#password_input'),
        error = $('#error')


        loginForm.submit(function (event) {
            event.preventDefault()
            error.text('')
            let data = {
                username: username.val(),
                password: password.val()
            }

            try {
                data = validation.checkLoginFields(data)
            } catch (e) {
                console.error(e.message)
                error.text(e.message)
                return
            }
            $.ajax({
                url: '/login',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(data) {
                    if (data.success) {
                        window.location.href = '/'
                    }
                },
                error: function(e) {
                    console.error(e.responseJSON.error)
                    error.text(e.responseJSON.error)
                },
            });
        })
})(window.jQuery)