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

    /* Get Current Geoloaction */
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        map.panTo(pos);

        /* Create You are here Marker Point */
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(pos.lat, pos.lng),
            map: map
        });

        var walkRouteCoordinates = [
            { lat: -27.4650419, lng: 152.9268182 },
            { lat: -27.4654989, lng: 152.9282448 },
            { lat: -27.4654489, lng: 152.9279491 },
            { lat: -27.4654489, lng: 152.9277872 }
        ];
        var walkRoute = new google.maps.Polyline({
            path: walkRouteCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });


        walkRoute.setMap(map);

    }, function() {
        handleLocationError(true, map.getCenter());
    });
}