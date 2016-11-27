function getCurrentPosition(map, newMarker, callback) {
    /* Get Current Geoloaction */
    navigator.geolocation.getCurrentPosition(function(position) {
        userAllowedTracking = true;

        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        /* Create You are here Marker Point */
        if (newMarker) {
            myMarker = new google.maps.Marker({
                position: new google.maps.LatLng(pos.lat, pos.lng),
                map: map,
                icon: {
                    url: 'assets/img/drive.svg',
                    // Magic numbers
                    scaledSize: new google.maps.Size(30, 30),
                }
            });
        } else {
            myMarker.setPosition(new google.maps.LatLng(pos.lat, pos.lng));
        }

        map.panTo(pos);

        if (callback) {
            callback(pos);
        }
    }, function() {
        handleLocationError(true, map.getCenter());
    });
}