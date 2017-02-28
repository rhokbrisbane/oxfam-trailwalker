// global mocks
global.google = {
  maps: {
    LatLng: (lat, lng) => ({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),

      lat: () => this.latitude,
      lng: () => this.longitude
    }),

    LatLngBounds: (ne, sw) => ({
      getSouthWest: () => sw,
      getNorthEast: () => ne
    }),

    Map: function () {
      return {
        setOptions: () => { }
      };
    },

    OverlayView: () => { },
    InfoWindow: () => { },
    Marker: () => { },
    MarkerImage: () => { },
    Point: () => { },
    Size: () => { },
    ControlPosition: {},
    MapTypeId: {}
  }
};