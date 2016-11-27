function fbInit() {
    var fbAppId = '206742363104102'; // dev
    if (window.location.hostname === 'findmeawalk.com') {
        fbAppId = '206735286438143'; // prod
    }

    window.fbAsyncInit = function() {
        FB.init({
            appId      : fbAppId,
            xfbml      : true,
            version    : 'v2.8'
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

function fbShare(permalinkParam) {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            fbShareDialog(permalinkParam);
        } else {
            FB.login(function(response) {
                if (response.authResponse) {
                    FB.api('/me', function(response) {                        
                        fbShareDialog(permalinkParam);
                    });
                }
            });
        }
    });
}

function fbShareDialog(permalinkParam) {
    FB.ui({
        method: 'share',
        href: 'https://findmeawalk.com#' + permalinkParam,
    }, function(response){});
}