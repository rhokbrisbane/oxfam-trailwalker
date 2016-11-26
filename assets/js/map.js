function getCurrentPosition(map, newMarker, callback) {
    /* Get Current Geoloaction */
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        map.panTo(pos);

        /* Create You are here Marker Point */
        if (newMarker) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(pos.lat, pos.lng),
                map: map
            });
        }

        if (callback) {
            callback();
        }
    }, function() {
        handleLocationError(true, map.getCenter());
    });
}
