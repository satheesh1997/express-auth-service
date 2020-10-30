

function login(emailElement, passwordElement) {
    if(!$('#errorAlert').hasClass('invisible'))
        $('#errorAlert').addClass('invisible');
    let loginBtn = $("#loginbtn");
    let loginSpin = $("#loginbtn span");

    loginBtn.prop('disabled', true);
    loginSpin.toggleClass('myFade');

    let email = emailElement.val();
    let password = passwordElement.val();
    $.ajax({
        method: 'post',
        url: '/users/login/',
        contentType: 'application/json',
        data: JSON.stringify({ email, password})
    }). done(function(){
        const query = new URLSearchParams(window.location.search);
        if(query.has('next')){
            window.location.replace(query.get('next'));
        } else {
            window.location.replace("/services/");
        }
    }) .fail(function(){
        $('#errorAlert').removeClass('invisible');

        loginSpin.toggleClass('myFade');
        loginBtn.prop('disabled', false);
    })
}


function forgetPassword() {
    let resetEmail = $('#resetEmail').val();
    $.ajax({
        method: 'post',
        url: '/users/forgot',
        data: JSON.stringify({email: resetEmail})
    }).done(function(){
        console.log('Success')
    }).fail(function(){
        console.log("failed");
    })
}