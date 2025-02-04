import { Injectable } from '@angular/core';
import { MapInformation, MapPlaygroundInformation } from '../models/map-selection.model';
import { map, Observable, of } from 'rxjs';
import { PlaygroundDimensions } from '../../../playground/domain/models/playground.model';
import { PlaygroundGridGenerator } from '../../../playground/domain/generators/playground-grid-generator';
import { ResourceGenerator } from '../../../resources/domain/classes/generators/resource-generator';

//Todo implement me as a repository
@Injectable({
  providedIn: 'root'
})
export class MapSelectionService {
  private readonly _gridGenerator = new PlaygroundGridGenerator();
  private readonly _resourceGenerator = new ResourceGenerator();

  private readonly maps: MapInformation[] = [{
    name: 'Hell\'s Paradise',
    createdAt: new Date(),
    creator: { id: '1', name: 'System', profileUrl: 'assets/robot.png' },
    playgroundInformation: this.generateMapPlaygroundInformation({ playgroundHeight: 9, playgroundWidth: 9 }),
    id: 'map-1',
    seed: '12345',
    previewUrl: 'assets/maps/default.png',
  }, {
    name: 'Abyss Palace',
    createdAt: new Date(),
    creator: { id: '1', name: 'System', profileUrl: 'assets/robot.png' },
    previewUrl: 'assets/maps/default.png',
    playgroundInformation: this.generateMapPlaygroundInformation({ playgroundHeight: 9, playgroundWidth: 9 }),
    id: 'map-2',
    seed: '5232'
  },
  {
    name: 'Gumbas Log',
    createdAt: new Date(),
    creator: { id: '1', name: 'System', profileUrl: 'assets/robot.png' },
    previewUrl: 'assets/maps/default.png',
    playgroundInformation: this.generateMapPlaygroundInformation({ playgroundHeight: 9, playgroundWidth: 9 }),
    id: 'map-3',
    seed: '52356'
  },
  {
    name: 'Test Map',
    createdAt: new Date(),
    creator: { id: '1', name: 'System', profileUrl: 'assets/robot.png' },
    previewUrl: 'assets/maps/default.png',
    playgroundInformation: this.generateMapPlaygroundInformation({ playgroundHeight: 9, playgroundWidth: 9 }),
    id: 'map-4',
    seed: '68756'
  },{
    name: 'Test Map 2',
    createdAt: new Date(),
    creator: { id: '1', name: 'System', profileUrl: 'assets/robot.png' },
    previewUrl: 'assets/maps/default.png',
    playgroundInformation: this.generateMapPlaygroundInformation({ playgroundHeight: 9, playgroundWidth: 9 }),
    id: 'map-5',
    seed: '135235'
  },{
    name: 'Test Map 3',
    createdAt: new Date(),
    creator: { id: '1', name: 'System', profileUrl: 'assets/robot.png' },
    previewUrl: 'assets/maps/default.png',
    playgroundInformation: this.generateMapPlaygroundInformation({ playgroundHeight: 10, playgroundWidth: 10 }),
    id: 'map-6',
    seed: '634547'
  },{
    name: 'Test Map 4',
    createdAt: new Date(),
    creator: { id: '1', name: 'System', profileUrl: 'assets/robot.png' },
    previewUrl: 'assets/maps/default.png',
    playgroundInformation: this.generateMapPlaygroundInformation({ playgroundHeight: 8, playgroundWidth: 8 }),
    id: 'map-7',
    seed: '74522'
  }, {
    name: 'Test Map 5',
    createdAt: new Date(),
    creator: { id: '1', name: 'System', profileUrl: 'assets/robot.png' },
    previewUrl: 'assets/maps/default.png',
    id: 'map-8',
    seed: '523235',
    playgroundInformation: this.generateMapPlaygroundInformation({ playgroundHeight: 15, playgroundWidth: 15 }),
  }];

  public getMaps(): MapInformation[] {
    return this.maps;
  }

  public selectMaps(string: string | null = ''): Observable<MapInformation[]> {
    return of(this.maps).pipe(
      map((maps) => {
        if (string === '' || string === null) return maps;
        return maps.filter((map) => map.name.toLowerCase().includes(string.toLowerCase()));
      })
    );
  }

  private generateMapPlaygroundInformation(dimensions: PlaygroundDimensions): MapPlaygroundInformation {
    const fields = this._gridGenerator.generateGrid(dimensions);
    const resources = this._resourceGenerator.generateResources(fields, dimensions);
    return {
      dimensions,
      fields,
      resourceFields: resources
    }

  }
}
