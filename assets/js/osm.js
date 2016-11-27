/*
 * Happy cache
 * TODO: localstorage?
 */
var osmDataCache = {};

function getOsmNodes(slat, slng, nlat, nlng, callback) {
  if (osmDataCache.osm3s) {
    callback(osmDataCache);
  }

  var bbox = slat.toString() + ',' + slng.toString() + ',' + nlat.toString() + ',' + nlng.toString();

  var osmQuery ='[out:json];way[highway=path][foot=yes][surface=ground](' + bbox + ');out body;>;out skel qt;';

  var url = 'https://overpass-api.de/api/interpreter?data=' + osmQuery;

  $.get(url, callback);
}

function getRandomWalkFromOsmDataset(data) {
  // Filter down only to our walks
  var walks = data.elements.filter(
    function(e) { 
      if (e.type === 'way') return e; 
    });
  
  // Select a random one
  var chosenWalk = walks[Math.floor(Math.random() * walks.length)];

  // Find all the nodes for our random walk
  var nodesWithGeoData = chosenWalk.nodes.map(function(wayNode) {
    var osmNode = data.elements.filter(function(node) {
      return node.type === 'node' 
              && node.id === wayNode;
    })[0];

    return {lat: osmNode.lat, lng: osmNode.lon};
  });

  // Throw them all together
  chosenWalk.nodes = nodesWithGeoData;

  return chosenWalk
}

// distance.js from https://github.com/Maciek416/gps-distance/

var RADIUS = 6371;

var toRad = function(n) {
  return n * Math.PI / 180;
};

var getDistance = function(from, to) {
  var fromLat = from[0];
  var fromLon = from[1];
  var toLat = to[0];
  var toLon = to[1];

  var dLat = toRad(toLat - fromLat);
  var dLon = toRad(toLon - fromLon);
  var fromLat = toRad(fromLat);
  var toLat = toRad(toLat);

  var a = Math.pow(Math.sin(dLat / 2), 2) +
          (Math.pow(Math.sin(dLon / 2), 2) * Math.cos(fromLat) * Math.cos(toLat));
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return RADIUS * c;
};

var measurePath = function(points) {
  return points.reduce(function(memo, point) {
    var distance = memo.lastPoint === null ? 0 : getDistance(memo.lastPoint, point);
    return { lastPoint: point, distance: distance + memo.distance };
  }, { lastPoint: null, distance: 0 }).distance;
};