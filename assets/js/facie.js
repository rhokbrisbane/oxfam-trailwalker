var fbConnected = false;

$(document).ready(function() {
    $("#loading").fadeOut("slow");
    $('.lets-do-it').on('click', function() {
        fbShareDialog(window.location.href);
        // if (!fbConnected) {            
        //     FB.login(function(response) {
        //         if (response.authResponse) {
        //             //FB.api('/me', function(response) {
        //                 fbConnected = true;               
        //                 fbShareDialog(window.location.href);
        //             //});
        //         }
        //     });
        // } else {
        //     fbShareDialog(window.location.href);
        // }
    });
});

function fbAppId() {
    var id = '206742363104102'; // dev
    if (window.location.hostname === 'findmeawalk.com') {
        id = '206735286438143'; // prod
    }
    return id;
}

function fbInit() {
    window.fbAsyncInit = function() {
        FB.init({
            appId      : fbAppId(),
            xfbml      : true,
            version    : 'v2.8',
            status     : true
        });

        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                fbConnected = true;
            }
        });
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_AU/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

function fbShareDialog(permalinkParam) {
    FB.ui({
        app_id: fbAppId(),
        method: 'share',
        href: 'https://findmeawalk.com#' + permalinkParam,
        display: 'popup',
        redirect_uri: 'https://findmeawalk.com#' + permalinkParam
    }, function(response){});
}