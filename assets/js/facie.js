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