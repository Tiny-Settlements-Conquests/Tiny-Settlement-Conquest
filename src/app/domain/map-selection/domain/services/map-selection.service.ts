import { Injectable } from '@angular/core';
import { SavedMap } from '../models/map-selection.model';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapSelectionService {

  private readonly maps: SavedMap[] = [{
    name: 'Hell\'s Paradise',
    createdAt: new Date(),
    creator: { id: '1', name: 'xScodayx', profileUrl: 'assets/robot.png' },
    dimensions: { gridHeight: 5, gridWidth: 5 },
    id: 'map-1',
    seed: '12345',
    previewUrl: 'assets/maps/default.png',
  }, {
    name: 'Abyss Palace',
    createdAt: new Date(),
    creator: { id: '1', name: 'xScodayx', profileUrl: 'assets/robot.png' },
    dimensions: { gridHeight: 5, gridWidth: 5 },
    previewUrl: 'assets/maps/default.png',
    id: 'map-2',
    seed: '5232'
  },
  {
    name: 'Gumbas Log',
    createdAt: new Date(),
    creator: { id: '1', name: 'xScodayx', profileUrl: 'assets/robot.png' },
    dimensions: { gridHeight: 5, gridWidth: 5 },
    previewUrl: 'assets/maps/default.png',
    id: 'map-3',
    seed: '52356'
  },
  {
    name: 'Hell\'s Paradise',
    createdAt: new Date(),
    creator: { id: '1', name: 'xScodayx', profileUrl: 'assets/robot.png' },
    dimensions: { gridHeight: 5, gridWidth: 5 },
    previewUrl: 'assets/maps/default.png',
    id: 'map-4',
    seed: '68756'
  },{
    name: 'Hell\'s Paradise',
    createdAt: new Date(),
    creator: { id: '1', name: 'xScodayx', profileUrl: 'assets/robot.png' },
    dimensions: { gridHeight: 5, gridWidth: 5 },
    previewUrl: 'assets/maps/default.png',
    id: 'map-5',
    seed: '135235'
  },{
    name: 'Hell\'s Paradise',
    createdAt: new Date(),
    creator: { id: '1', name: 'xScodayx', profileUrl: 'assets/robot.png' },
    dimensions: { gridHeight: 5, gridWidth: 5 },
    previewUrl: 'assets/maps/default.png',
    id: 'map-6',
    seed: '634547'
  },{
    name: 'Hell\'s Paradise',
    createdAt: new Date(),
    creator: { id: '1', name: 'xScodayx', profileUrl: 'assets/robot.png' },
    dimensions: { gridHeight: 5, gridWidth: 5 },
    previewUrl: 'assets/maps/default.png',
    id: 'map-7',
    seed: '74522'
  }, {
    name: 'Hell\'s Paradise',
    createdAt: new Date(),
    creator: { id: '1', name: 'xScodayx', profileUrl: 'assets/robot.png' },
    dimensions: { gridHeight: 5, gridWidth: 5 },
    previewUrl: 'assets/maps/default.png',
    id: 'map-7',
    seed: '74522'
  }]

  public selectMaps(string: string | null = ''): Observable<SavedMap[]> {
    return of(this.maps).pipe(
      map((maps) => {
        if (string === '' || string === null) return maps;
        return maps.filter((map) => map.name.toLowerCase().includes(string.toLowerCase()));
      })
    );
  }
}
