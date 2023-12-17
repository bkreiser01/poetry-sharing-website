import validation from './validation.js';

let errored

function removeLeadingErrors(str) {
    let words = str.split(/\s+/);
    let filteredWords = words.map(word => word.toLowerCase() !== 'error:' ? word : '');
    return filteredWords.join(' ').trim();;
}


let validate = (data, func, err) => {
    try {
        data = func(data)
    } catch (e) {
        err.text(removeLeadingErrors(e.toString()))
        errored = true
    }

    return data
}

(function($) {
    let loginForm = $('#register_form')
    
    // Form errors
    let username_error = $('#username_error'),
        email_error = $('#email_error'),
        password_error = $('#password_error'),
        password_confirm_error = $('#password_confirm_error'),
        privacy_error = $('#privacy_error'),
        error = $('#error')


        loginForm.submit(function (event) {
            event.preventDefault()

            let username = $('#username_input'),
                email = $('#email_input'),
                password = $('#password_input'),
                password_confirm = $('#password_confirm'),
                privacy = $('#privacy_input')

            username_error.text('')
            email_error.text('')
            password_error.text('')
            password_confirm_error.text('')
            privacy_error.text('')
            error.text('')
            errored = false

            let data = {
                username: username.val(),
                email: email.val(),
                password: password.val(),
                password_confirm: password_confirm.val(),
                privacy: privacy.val()
            }

            data.username = validate(data.username, validation.checkUsername, username_error)
            data.email = validate(data.email, validation.checkEmail, email_error)
            data.password = validate(data.password, validation.checkPassword, password_error)
            if (data.password_confirm != data.password) {
                password_confirm_error.text('Passwords do not match')
                errored = true
            }
            data.privacy = validate(data.privacy, validation.checkPrivacy, privacy_error)

            if (errored) {
                errored = false
                console.error('Form validation failed')
                return
            }
            
            $.ajax({
                url: '/register',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(data) {
                    console.log("success")
                    if (data.success) {
                        window.location.href = '/login'
                    }
                },
                error: function(e) {
                    console.error(e.responseJSON.error)
                    error.text(e.responseJSON.error)
                },
            });
        })
})(window.jQuery)