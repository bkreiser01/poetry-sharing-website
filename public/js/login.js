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
                type: 'post',
                data: JSON.stringify(data),
                headers: {
                    'x-auth-token': localStorage.accessToken,
                    "Content-Type": "application/json"
                },
                dataType: 'json'
            }).fail(function (xhr, status, e) {
                if (xhr.responseJSON.error != undefined) {
                    console.error(xhr.responseJSON.error)
                    error.text(xhr.responseJSON.error)
                } else {
                    error.text("Internal Server Error")
                }
            })
        })
})(window.jQuery)