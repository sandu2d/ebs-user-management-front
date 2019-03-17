let isLogged = true;
let user = {};

myFetch(`${API}/account`, function(data) {
    isLogged = data.error ? false : true;
    user = data;
    renderPage();
});

$('.login-acc').click(function (event) {
    event.preventDefault();
    
    body = JSON.stringify({user: {
        email: $('.login-form > .form > .email').val(),
        password: $('.login-form > .form > .password').val()
    }});

    myFetch(`${API}/account/login`, function(data) {
        errorMessage = '';
        if (data['user.email']) {
            errorMessage += `<br/>${data['user.email']}`;
        } else if (data['user.password']) {
            errorMessage += `<br/>${data['user.password']}`;
        } else {
            isLogged = true;
            localStorage.setItem('token', data.token);
            document.location.reload(true)
        }

        sendErrorMessage(errorMessage);
    }, body, 'POST');
});

$('.register-acc').click(function (event) {
    event.preventDefault();

    body = JSON.stringify({user: {
        name: $('.register-form > .form > .name').val(),
        email: $('.register-form > .form > .email').val(),
        password: $('.register-form > .form > .password').val()
    }});

    myFetch(`${API}/account/register`, function(data) {
        errorMessage = '';
        if (data['user.email']) {
            errorMessage += `<br/>${data['user.email']}`;
        } else if (data['user.name']) {
            errorMessage += `<br/>${data['user.name']}`;
        } else if (data['user.password']) {
            errorMessage += `<br/>${data['user.password']}`;
        } else {
            isLogged = true;
            localStorage.setItem('token', data.token);
            document.location.reload(true)
        }

        sendErrorMessage(errorMessage);
    }, body, 'POST');
});

$('.logout').click(function () {
    myFetch(`${API}/account/logout`, function (data) {
        localStorage.clear();
        document.location.reload(true)
    }, null, 'DELETE');
});