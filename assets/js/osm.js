function getNodes(slat, slng, nlat, nlng) {
    var bbox = slat.toString() + ',' + slng.toString() + ',' + nlat.toString() + ',' + nlng.toString();
    var url = 'https://overpass-api.de/api/interpreter?data=[out:json];way[highway=path][foot=yes][surface=ground](' + bbox + ');out body;>;out skel qt;';

    $.get(url, function( data ) {
        console.log(data);
    });
}