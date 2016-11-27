function getDirections(origin, destination) {

    // Building the Query String for the Google API
    var request = {
        origin: origin.toString(),
        destination: destination.toString(),
        travelMode: 'DRIVING',
    };

    // Directions Service used to render Result to Map
    var directionsService = new google.maps.DirectionsService();

    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            console.log(result);
            setDirections(result);
        }
    });
}