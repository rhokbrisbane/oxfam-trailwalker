/* @flow */

export type Coordinates = { lat: number, lng: number };

export type Walk = {
  trailName?: string,
  distance: number,
  difficulty?: string,
  nodePath: Array<Coordinates>
};
