function fbShare(permalinkParam) {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            FB.ui({
                method: 'share',
                href: 'https://www.facebook.com/sharer/sharer.php?u=findmeawalk.com#' + permalinkParam,
            }, function(response){});
        }
    });
}