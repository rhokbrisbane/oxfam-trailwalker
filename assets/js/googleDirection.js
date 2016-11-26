function getDirections(origin, destination, mode, key) {
    this.origin = 'origin=' + origin.toString();
    this.destination = '&destination' + destination.toString();
    this.mode = '&mode=transit';
    this.key = '&key' + key.toString();
    var url = 'https://maps.googleapis.com/maps/api/directions/json?origin' + origin + destination + mode + key;
    debugger;

    $.get(url, function(data) {
        console.log(url);
        console.log(data);
    });
}