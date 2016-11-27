/*
 * Go facebook
 */
fbInit();

/*
 * SETTING STLYING VARIABLES FOR PATH CONSTRUCTION
 * Stlying Variables for Path Routes 
 */
var walkStroke = '#50af47';
var directionsStroke = '#e70052';
var directionStrokeWeight = 5;
var strokeOpacity = 0.5;
var strokeWeight = 10;


/*
 * CONSTANTS FOR PATH/DISTANCE CALCULATION
 */
var KM_RADIUS_TO_SEARCH_FOR_ROUTES_NEAR = 0.25;
var DEFAULT_TRAIL_NAME = "Yours to discover!"

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

    getCurrentPosition(map, true, function(pos) {
        setupRoutes(map, pos);
    });

    function setupRoutes(map, pos) {
        // TODO: here would be a good place to check for a static walk ID

        // fetch a random walk from OSM near us
        getOsmNodes(
            pos.lat - KM_RADIUS_TO_SEARCH_FOR_ROUTES_NEAR,
            pos.lng - KM_RADIUS_TO_SEARCH_FOR_ROUTES_NEAR,
            pos.lat + KM_RADIUS_TO_SEARCH_FOR_ROUTES_NEAR,
            pos.lng + KM_RADIUS_TO_SEARCH_FOR_ROUTES_NEAR,
            function(data) {
                var walkRoute = getRandomWalkFromOsmDataset(data);

                renderWalk(walkRoute, pos);
            }
        );
    }

    function renderWalk(walkRoute, pos) {
        updateTrailNameView(walkRoute.tags.name || DEFAULT_TRAIL_NAME);

        var walkRouteCoordinates = walkRoute.nodes;

        updatePathLengthView(calculatePathLength(walkRouteCoordinates));

        // Update the Difficulty UI element
        updateTrailDfficultyView(walkRoute.tags.sac_scale);


        var walkRoute = new google.maps.Polyline({
            path: walkRouteCoordinates,
            geodesic: true,
            strokeColor: walkStroke,
            strokeOpacity: strokeOpacity,
            strokeWeight: strokeWeight
        });

        walkRoute.setMap(map);

        var walkRouteStartingPoint = walkRouteCoordinates[0];
        var walkRouteEndPoint = walkRouteCoordinates[walkRouteCoordinates.length - 1];
        console.log(walkRouteEndPoint);

        /* Deals with Getting Directions from Google API and Rendering the Polyline */
        getDirections(
            [pos.lat, pos.lng], [walkRouteStartingPoint.lat, walkRouteStartingPoint.lng]
        );

        // Render Customer Start and End Markers
        var start = new google.maps.Marker({
            position: new google.maps.LatLng(walkRouteStartingPoint.lat, walkRouteStartingPoint.lng),
            map: map,
            icon: {
                url: 'assets/img/walk.svg',
                scaledSize: new google.maps.Size(30, 41.43),
            }
        });

        // Finish Marker
        // var end = new google.maps.Marker({
        //     position: new google.maps.LatLng(walkRouteEndPoint.lat, walkRouteEndPoint.lng),
        //     map: map,
        //     icon: {
        //         url: 'assets/img/end_marker.svg',
        //         scaledSize: new google.maps.Size(30, 45.8),
        //     }
        // });
    }
}

// Returns path length in km
function calculatePathLength(listOfCoordinates) {
    var measurablePath = listOfCoordinates.map(function(e) {
        return [e.lat, e.lng];
    })

    var pathLength = measurePath(measurablePath);

    /* If the distance between the starting point and the end point is more than 200m
     * then we assume the walk is an "out and back" where we need to return along the
     * same path to the starting point
     */
    if (getDistance(measurablePath[0], measurablePath[measurablePath.length - 1]) > 0.2) {
        pathLength *= 2;
    }

    return pathLength;
}
/*
 * Updates UI Element Tracking Distance of Path 
 * Measured in KMs
 */
function updatePathLengthView(lengthInKm) {
    var km = Math.round(lengthInKm * 10) / 10;

    $('#length').text(km + "km");
}

function updateTrailNameView(trailName) {
    $('#trailName').text(trailName);
}

function updateTrailDfficultyView(trialDifficulty) {
    $('#trailDifficutly').text(trialDifficulty);
}


/* 
 * Loads the Directions into the Renderer which 
 * outputs them onto the Map
 */
function setDirections(result) {
    // For Dashed Pink Line
    // var lineSymbol = {
    //     path: google.maps.SymbolPath.CIRCLE,
    //     fillOpacity: 1,
    //     scale: 3
    // };

    // var polylineDotted = new google.maps.Polyline({
    //     strokeColor: '#0eb7f6',
    //     strokeOpacity: 0,
    //     fillOpacity: 0,
    //     icons: [{
    //         icon: lineSymbol,
    //         offset: '0',
    //         repeat: '10px'
    //     }],
    // });

    // To Supress Markers add { suppressMarkers:true } to the DirectionsRenderer Constructor
    var directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: directionsStroke,
            strokeOpacity: strokeOpacity,
            strokeWeight: directionStrokeWeight,
            // icon: lineSymbol
        }
    });

    directionsRenderer.setMap(map);
    directionsRenderer.setDirections(result);
}