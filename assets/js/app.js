function initMap() {
    var mapOptions = {
        zoom: 12,
        disableDefaultUI: true,
        draggable: true,
        scrollwheel: true,
        panControl: false,
        mapTypeControl: false,
        scaleControl: false,
        zoomControl: true,
        //maxZoom: 6,
        //minZoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        map.panTo(pos);

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(pos.lat, pos.lng),
            map: map
        });

        getNodes(
            map.getBounds().getSouthWest().lat(),
            map.getBounds().getSouthWest().lng(),
            map.getBounds().getNorthEast().lat(),
            map.getBounds().getNorthEast().lng()
        );
    }, function () {
        handleLocationError(true, map.getCenter());
    });
}