import validation from '/public/js/validation.js';

(function ($) {
    let form = $('#user_edit'),
        username_error = $('#username_error'),
        email_error = $('#email_error'),
        password_error = $('#password_error'),
        password_confirm_error = $('#password_confirm_error'),
        bio_error = $('#bio_error'),
        error = $('#error'),
        success = $('#success')

    form.submit(function (event) {
        event.preventDefault()

        let username = $('#username_input').val().trim(),
            email = $('#email_input').val().trim(),
            password = $('#password_input').val(),
            password_confirm = $('#password_confirm').val(),
            bio = $('#bio').val().trim(),
            submit = $('#submit')

        let errors_exist = false
        username_error.text('')
        email_error.text('')
        password_error.text('')
        password_confirm_error.text('')
        bio_error.text('')
        error.text('')
        success.text('')

        let data = {}

        if (username != "") {
            try {
                username = validation.checkUsername(username)
                data.username = username
            } catch (e) {
                console.error(e.message)
                username_error.text(e.message)
                errors_exist = true
            }
        }

        if (email != "") {
            try {
                email = validation.checkEmail(email)
                data.email = email
            } catch (e) {
                console.error(e.message)
                email_error.text(e.message)
                errors_exist = true
            }
        }

        if (password != "") {
            try {
                password = validation.checkPassword(password)
            } catch (e) {
                console.error(e.message)
                password_error.text(e.message)
                errors_exist = true
            }

            if (password != password_confirm) {
                console.error('Passwords do not match')
                password_confirm_error.text('Passwords do not match')
            }
            data.password = password
        }

        if (bio != "") {
            try {
                bio = validation.checkString(bio)
                data.bio = bio
            } catch (e) {
                console.error(e.message)
                bio_error.text(e.message)
                errors_exist = true
            }
        }

        if (!errors_exist) {
            $.ajax({
                url: '/user/edit',
                method: 'PATCH',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(data) {
                    console.log(data.success)
                    success.text(data.success)
                    window.location.href = '/user'
                },
                error: function(e) {
                    console.log(e)
                    console.error(e.responseJSON.error)
                    error.text(e.responseJSON.error)
                },
            });
        }
    })
}(window.jQuery))