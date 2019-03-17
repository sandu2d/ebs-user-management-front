const API = "http://localhost/ebs-user-management/public/v1";

function myFetch(url, callbackFunction, body = null, method = 'GET')
{
    fetch(url, {
        method: method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "token": localStorage.getItem('token')
        },
        body: body
    })
    .then(response => {
        switch (response.status) {
            case 200:
            case 201:
            case 422:
            case 404:
            case 401: {
                return Promise.resolve(response);
            }
            default: {
                return Promise.reject(new Error(response.statusText));
            }
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        return callbackFunction(data);
    });
}

function sendErrorMessage(text)
{
    $('.errors').html(text);
}

function getUserList()
{
    myFetch(`${API}/users`, function (data) {
        data.forEach(user => {
            const tr = $('<tr>');

            tr.append($(`<td>${user.id}</td>`));
            tr.append($(`<td>${user.name}</td>`));
            tr.append($(`<td>${user.email}</td>`));
            tr.append($(`<td>${user.groups.map(group => {return group.name + ' '})}</td>`));
            tr.append($(`<td>${user.activated}</td>`));
            tr.append($(`<td>${user.blocked}</td>`));
            tr.append(`<div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><span class="caret"></span></button>
            <ul class="dropdown-menu">
              <li><a href="#" onclick="activateUser(${user.id})">activate</a></li>
              <li><a href="#" onclick="blockUser(${user.id})">block</a></li>
              <li><a href="#" onclick="unblockUser(${user.id})">unblock</a></li>
              <li><a href="#" onclick="showEditUser(${user.id},'${user.name}','${user.email}')">edit</a></li>
              <li><a href="#" onclick="deleteUser(${user.id})">delete</a></li>
              <li><a href="#" onclick="showSyncGroup(${user.id})">sync group</a></li>
            </ul>
          </div>`);

            $('.user-list tbody').append(tr);
        });
    })
}

function showSyncGroup(id)
{
    $('.sync-user-groups input[name=id]').val(id);
    $('.sync-user-groups').show();
}

$('.cancel-sync-user').click(function (event) {
    event.preventDefault();

    $('.sync-user-groups').hide();
});

$('.save-sync-user').click(function (event) {
    event.preventDefault();

    myFetch(`${API}/users/${$('.sync-user-groups > .form > .id').val()}/${$('.sync-user-groups > .form > .select').val()}`, function (data) {
        if (data.error) {
            sendErrorMessage( data.error.message);
        } else {
            document.location.reload(true)
        }
    }, null, 'POST');
});

function showEditUser(id, name, email)
{
    $('.edit-user').show();
    $('.edit-user input[name=id]').val(id);
    $('.edit-user input[name=name]').val(name);
    $('.edit-user input[name=email]').val(email);
}

$('.cancel-edit-user').click(function(event) {
    event.preventDefault();

    $('.edit-user').hide();
});

$('.save-edit-user').click(function (event) {
    event.preventDefault();

    body = JSON.stringify({user: {
        name: $('.edit-user > .form > .name').val(),
        email: $('.edit-user > .form > .email').val(),
        password: $('.edit-user > .form > .password').val()
    }, _method: 'PUT'});

    myFetch(`${API}/users/${$('.edit-user > .form > .id').val()}`, function (data) {
        errorMessage = '';
        if (data['user.email']) {
            errorMessage += `<br/>${data['user.email']}`;
        } else if (data['user.name']) {
            errorMessage += `<br/>${data['user.name']}`;
        } else if (data['user.password']) {
            errorMessage += `<br/>${data['user.password']}`;
        } else if (data.error) {
            errorMessage += data.error.message;
        } else {
            document.location.reload(true)
        }

        sendErrorMessage(errorMessage);
    }, body, 'POST');
});

$('.create-user').click(function (event) {
    event.preventDefault();

    body = JSON.stringify({user: {
        name: $('#menu12 > .form > .name').val(),
        email: $('#menu12 > .form > .email').val(),
        password: $('#menu12 > .form > .password').val()
    }});

    myFetch(`${API}/users`, function (data) {
        errorMessage = '';
        if (data['user.email']) {
            errorMessage += `<br/>${data['user.email']}`;
        } else if (data['user.name']) {
            errorMessage += `<br/>${data['user.name']}`;
        } else if (data['user.password']) {
            errorMessage += `<br/>${data['user.password']}`;
        } else if (data.error) {
            errorMessage += data.error.message;
        } else {
            document.location.reload(true)
        }

        sendErrorMessage(errorMessage);
    }, body, 'POST');
});

$('.create-group').click(function (event) {
    event.preventDefault();

    body = JSON.stringify({group: {
        name: $('#menu22 > .form > .name').val()
    }});

    myFetch(`${API}/groups`, function (data) {
        errorMessage = '';
        if (data['group.name']) {
            errorMessage += `<br/>${data['group.name']}`;
        } else if (data.error) {
            errorMessage += data.error.message;
        } else {
            document.location.reload(true)
        }

        sendErrorMessage(errorMessage);
    }, body, 'POST');
});

function deleteUser(id)
{
    myFetch(`${API}/users/${id}`, function (data) {
        if (data.error) {
            sendErrorMessage(data.error.message);
        } else {
            document.location.reload(true)
        }
    }, null, 'DELETE');
}

function unblockUser(id)
{
    body = JSON.stringify({user: {
        status: 0
    }, _method: 'PUT'});

    myFetch(`${API}/users/${id}/block`, function (data) {
        if (data.error) {
            sendErrorMessage(data.error.message);
        } else {
            document.location.reload(true)
        }
    }, body, 'POST');
}

function blockUser(id)
{
    body = JSON.stringify({user: {
        status: 1
    }, _method: 'PUT'});

    myFetch(`${API}/users/${id}/block`, function (data) {
        if (data.error) {
            sendErrorMessage(data.error.message);
        } else {
            document.location.reload(true)
        }
    }, body, 'POST');
}

function activateUser(id)
{
    body = JSON.stringify({user: {
        status: 1
    }, _method: 'PUT'});

    myFetch(`${API}/users/${id}/activate`, function (data) {
        if (data.error) {
            sendErrorMessage(data.error.message);
        } else {
            document.location.reload(true)
        }
    }, body, 'POST');
}

function getGroupList()
{
    myFetch(`${API}/groups`, function (data) {
        let groups = '';
        data.forEach(group => {
            const tr = $('<tr>');

            tr.append($(`<td>${group.id}</td>`));
            tr.append($(`<td>${group.name}</td>`));
            tr.append($(`<td>${group.permissions.map(item => {return item.name + ' '})}</td>`));
            tr.append(`<div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><span class="caret"></span></button>
            <ul class="dropdown-menu">
              <li><a href="#" onclick="showEditGroup(${group.id},'${group.name}')">edit</a></li>
              <li><a href="#" onclick="deleteGroup(${group.id})">delete</a></li>
              <li><a href="#" onclick="showPermissions(${group.id})">sync permissions</a></li>
            </ul>
          </div>`);

            $('.group-list tbody').append(tr);

            groups += `<option value="${group.id}">${group.name}</option>`;
        });

        $('.sync-user-groups select').html(groups);
    })
}

function showPermissions(id)
{
    $('.sync-group-permissions input[name=id]').val(id);
    $('.sync-group-permissions').show();
}

$('.cancel-sync-group').click(function (event) {
    event.preventDefault();

    $('.sync-group-permissions').hide();
});

$('.save-sync-group').click(function (event) {
    event.preventDefault();

    body = JSON.stringify({group: {
        permissions: $('.sync-group-permissions .select').val()
    }});

    myFetch(`${API}/groups/${$('.sync-group-permissions .form .id').val()}/permissions`, function (data) {
        if (data.error) {
            sendErrorMessage(data.error.message);
        } else {
            document.location.reload(true)
        }
    }, body, 'POST');
});

function showEditGroup(id, name)
{
    $('.edit-group').show();
    $('.edit-group input[name=id]').val(id);
    $('.edit-group input[name=name]').val(name);
}

$('.save-edit-group').click(function (event) {
    event.preventDefault();

    body = JSON.stringify({group: {
        name: $('.edit-group > .form > .name').val()
    }, _method: 'PUT'});

    myFetch(`${API}/groups/${$('.edit-group > .form > .id').val()}`, function (data) {
        errorMessage = '';
        if (data['group.name']) {
            errorMessage += `<br/>${data['group.name']}`;
        } else if (data.error) {
            errorMessage += data.error.message;
        } else {
            document.location.reload(true)
        }

        sendErrorMessage(errorMessage);
    }, body, 'POST');
});

$('.cancel-edit-group').click(function (event) {
    event.preventDefault();

    $('.edit-group').hide();
});

function deleteGroup(id)
{
    myFetch(`${API}/groups/${id}`, function (data) {
        if (data.error) {
            sendErrorMessage(data.error.message);
        } else {
            document.location.reload(true)
        }
    }, null, 'DELETE');
}

function getPermissionList()
{
    myFetch(`${API}/permissions`, function (data) {
        let options = '';

        data.forEach(item => {
            const tr = $('<tr>');

            tr.append($(`<td>${item.id}</td>`));
            tr.append($(`<td>${item.name}</td>`));
            tr.append($(`<td>${item.code}</td>`));

            $('.per-list tbody').append(tr);

            options += `<option value="${item.id}">${item.name}</option>`;
        });

        $('.sync-group-permissions select').html(options);
    })
}

function renderPage()
{
    if (isLogged) {
        $('.logged').show();
        $('.not-logged').hide();

        $('#user-name').html(user.name);
        $('#user-groups').html(user.groups.map(group => {return group.name + ' '}));

        getUserList();
        getGroupList();
        getPermissionList();
    } else {
        $('.logged').hide();
        $('.not-logged').show();
    }
}

$('.open-register-form').click(function (event) {
    event.preventDefault();

    $('.login-form').hide();
    $('.register-form').show();
});

$('.open-login-form').click(function (event) {
    event.preventDefault();

    $('.login-form').show();
    $('.register-form').hide();
});