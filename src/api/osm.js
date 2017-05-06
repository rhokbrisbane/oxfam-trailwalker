/* @flow */

import type { PathDifficulty, WalkId } from '../Types';

const PERCENTAGE_LEEWAY_FOR_TARGET_LENGTH = 0.2;
const CLOSE_ENOUGH_TO_CONSIDER_ROUND_TRIP = 0.2 /* km */;

/*
 * Happy cache
 * TODO: localstorage?
 */
var osmDataCache = {};

export function getOsmNodes(slat: number, slng: number, nlat: number, nlng: number, callback: Function) {
  if (osmDataCache.osm3s) {
    callback(osmDataCache);
    return;
  }

  var bbox = slat.toString() + ',' + slng.toString() + ',' + nlat.toString() + ',' + nlng.toString();

  var osmQuery = '[out:json];way[highway=path][foot=yes][surface=ground](' + bbox + ');out body;>;out skel qt;';

  var url = 'https://overpass-api.de/api/interpreter?data=' + osmQuery;

  fetch(url).then(
    (response) => response.json()
  ).then((data) => {
    data = addNodeInformation(data);
    data = addDistanceInformation(data);

    osmDataCache = data;
    callback(data);
  });
}

export function getOsmWay(id: WalkId, callback: Function) {
  var osmQuery = '[out:json];way(' + id + ');out body;>;out skel qt;';

  var url = 'https://overpass-api.de/api/interpreter?data=' + osmQuery;

  fetch(url).then(
    (response) => response.json()
  ).then((data) => {
    data = addNodeInformation(data);
    data = addDistanceInformation(data);

    callback(data);
  });
}

function addDistanceInformation(data: Object) {
  var elementsWithDistance = data.elements.map(function (e) {
    if (onlyWays(e)) {
      e.tags.distance = calculatePathLength(e.nodes);
    }

    return e;
  });

  data.elements = elementsWithDistance;

  return data;
}

function addNodeInformation(data: Object) {
  var augmentedData = data.elements.map(function (element) {
    if (onlyWays(element)) {
      // Find all the nodes for our walk
      var nodesWithGeoData = element.nodes.map(function (wayNode) {

        // Find the node information for our way node
        var osmNode = data.elements.filter(function (node) {
          return node.type === 'node' &&
            node.id === wayNode;
        })[0];

        return { lat: osmNode.lat, lng: osmNode.lon };
      });

      // Throw them all together
      element.nodes = nodesWithGeoData;
    }

    return element;
  });

  // Remove the node information since it's all now in the ways
  data.elements = augmentedData.filter(onlyWays);

  return data;
}

export function getWalkFromOsmDatasetById(data: Object, id: WalkId) {
  for (var i = 0; i < data.elements.length; i++) {
    if (data.elements[i].id === id) {
      return data.elements[i];
    }
  }
  return;
}

export function getRandomWalkFromOsmDataset(data: Object, targetLength: number) {
  if (data.elements.length < 1) {
    return;
  }

  var walks = [];
  var leeway = PERCENTAGE_LEEWAY_FOR_TARGET_LENGTH;

  const targetLengthWithinLeeway = (leeway) => (walk) => {
    return walk.tags.distance < (targetLength * (1 + leeway)) &&
      walk.tags.distance > (targetLength * (1 - leeway))
  }

  // TODO: how far is too far before we say we've got nothing?
  while (true) {

    // Filter down only to walks close to our target length
    walks = data.elements.filter(targetLengthWithinLeeway(leeway));

    if (walks.length > 0) {
      break;
    }

    // No walks near this, expand our length and try again :(
    leeway *= 2;
  }

  console.log("Selecting a random walk from a total of ", walks.length, " options looking for", targetLength, 'km')

  // Select a random one
  return walks[Math.floor(Math.random() * walks.length)];
}

function onlyWays(e) {
  return e.type === 'way';
}

export function normalizePathDifficulty(trailDifficutly: string): PathDifficulty {
  if (!trailDifficutly) {
    return '';
  }

  switch (trailDifficutly) {
    case 'hiking':
    case 'mountain_hiking':
      return 'easy';
    case 'demanding_mountain_hiking':
    case 'alpine_hiking':
      return 'medium';
    default:
      return 'extreme';
  }
}

// distance.js from https://github.com/Maciek416/gps-distance/

var RADIUS = 6371;

var toRad = function (n) {
  return n * Math.PI / 180;
};

var getDistance = function (from, to) {
  var fromLat = from[0];
  var fromLon = from[1];
  var toLat = to[0];
  var toLon = to[1];

  var dLat = toRad(toLat - fromLat);
  var dLon = toRad(toLon - fromLon);
  fromLat = toRad(fromLat);
  toLat = toRad(toLat);

  var a = Math.pow(Math.sin(dLat / 2), 2) +
    (Math.pow(Math.sin(dLon / 2), 2) * Math.cos(fromLat) * Math.cos(toLat));
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return RADIUS * c;
};

var measurePath = function (points) {
  return points.reduce(function (memo, point) {
    var distance = memo.lastPoint === null ? 0 : getDistance(memo.lastPoint, point);
    return { lastPoint: point, distance: distance + memo.distance };
  }, { lastPoint: null, distance: 0 }).distance;
};

// end distance.js

// Returns path length in km
function calculatePathLength(listOfCoordinates) {
  var measurablePath = listOfCoordinates.map(function (e) {
    return [e.lat, e.lng];
  })

  var pathLength = measurePath(measurablePath);

  /* If the distance between the starting point and the end point is more than 200m
   * then we assume the walk is an "out and back" where we need to return along the
   * same path to the starting point
   */
  if (getDistance(measurablePath[0], measurablePath[measurablePath.length - 1]) > CLOSE_ENOUGH_TO_CONSIDER_ROUND_TRIP) {
    pathLength *= 2;
  }

  return pathLength;
}
