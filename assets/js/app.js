/*
 * SETTING STLYING VARIABLES FOR PATH CONSTRUCTION
 * Stlying Variables for Path Routes 
 */
var walkStroke = '#50af47';
var directionsStroke = '#e70052';
var strokeOpacity = 0.5;
var strokeWeight = 10;

/* 
 * SETTING CONSTRUCTION VARIABLES FOR GOOGLE MAP
 * Returns the Google Map Options 
 */

function getMapOptions() {
    return {
        zoom: 12,
        disableDefaultUI: true,
        draggable: true,
        scrollwheel: true,
        panControl: false,
        mapTypeControl: false,
        scaleControl: false,
        styles: [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#bdbdbd"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dadada"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#c9c9c9"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            }
        ],
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        //maxZoom: 6,
        //minZoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
}

/*
 *
 * Logic Not Related to Variable Setting Lives Here
 *
 *
 */


/* Creates the Google Map and sets Feature Flags and Options */
function initMap() {

    // Instantiates Google Map Object  
    map = new google.maps.Map(document.getElementById('map'), getMapOptions());

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


        // @TODO Make this Dynamic
        var walkRouteCoordinates = [
            { lat: -27.4650419, lng: 152.9268182 },
            { lat: -27.4654989, lng: 152.9282448 },
            { lat: -27.4654489, lng: 152.9279491 },
            { lat: -27.4654489, lng: 152.9277872 }
        ];

        updatePathLength(walkRouteCoordinates);

        var walkRoute = new google.maps.Polyline({
            path: walkRouteCoordinates,
            geodesic: true,
            strokeColor: walkStroke,
            strokeOpacity: strokeOpacity,
            strokeWeight: strokeWeight
        });

        walkRoute.setMap(map);

        // console.log(pos.lat);
        // console.log(pos.lng);
        // console.log(map.getBounds().getSouthWest().lat())
        // console.log(map.getBounds().getSouthWest().lng())
        // console.log(map.getBounds().getNorthEast().lat())
        // console.log(map.getBounds().getNorthEast().lng())

        // getNodes(
        //     pos.lat + .25,// map.getBounds().getSouthWest().lat(),
        //     pos.lng - .25,// map.getBounds().getSouthWest().lng(),
        //     pos.lat - .25,// map.getBounds().getNorthEast().lat(),
        //     pos.lng + .25// map.getBounds().getNorthEast().lng()
        // );
        getNodes(
            map.getBounds().getSouthWest().lat(),
            map.getBounds().getSouthWest().lng(),
            map.getBounds().getNorthEast().lat(),
            map.getBounds().getNorthEast().lng()
        );

        /* Deals with Getting Directions from Google API and Rendering the Polyline */
        getDirections(
            [-27.4654489, 152.9277872], [-27.4650419, 152.9268182]
        );

    }, function() {
        handleLocationError(true, map.getCenter());
    });
}


/*
 * Updates UI Element Tracking Distance of Path 
 * Measured in KMs
 */
function updatePathLength(listOfCoordinates) {

    var measurablePath = listOfCoordinates.map(function(e) {
        return [e.lat, e.lng]
    })

    var km = Math.round(measurePath(measurablePath) * 10) / 10;

    $('#length').text(km + "km");
}


/* 
 * Loads the Directions into the Renderer which 
 * outputs them onto the Map
 */
function setDirections(result) {
    // To Supress Markers add { suppressMarkers:true } to the DirectionsRenderer Constructor
    var directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
            strokeColor: directionsStroke,
            strokeOpacity: strokeOpacity,
            strokeWeight: strokeWeight,
        }
    });
    console.log(directionsRenderer);
    directionsRenderer.setMap(map);
    directionsRenderer.setDirections(result);
}