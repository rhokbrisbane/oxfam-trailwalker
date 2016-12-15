/* @flow */

export type Coordinates = { lat: number, lng: number };

export type PathDifficulty = '' | 'easy' | 'medium' | 'extreme';
export type WalkId = string;

export type Walk = {
  id: WalkId,
  trailName?: string,
  distance: number,
  difficulty?: PathDifficulty,
  nodePath: Array<Coordinates>
};
