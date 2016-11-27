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
                map: map
            });
        } else {
            myMarker.setPosition(new google.maps.LatLng(pos.lat, pos.lng));
        }

        map.panTo(pos);

        if (callback) {
            callback();
        }
    }, function() {
        handleLocationError(true, map.getCenter());
    });
}
