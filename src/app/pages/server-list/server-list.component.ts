import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockComponent } from '../../domain/layouts/ui/block/block.component';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { CommonModule, NgClass } from '@angular/common';
import { faLock, faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

export interface Server {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  passwordProtected: boolean;
  isIngame: boolean;
  mapName: string;
  mapImageUrl: string;
}

@Component({
  selector: 'app-server-list',
  standalone: true,
  imports: [
    BlockComponent,
    TitleComponent,
    FontAwesomeModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './server-list.component.html',
  styleUrl: './server-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerListComponent { 
  public readonly icons = {
    lock: faLock,
    map: faMap
  }

  public servers: Server[] = this.generateFakeServers();

  public generateFakeServers() {
    let servers: Server[] = [];
    let randomNames = ['Clemens', 'Christine', 'Andreas', 'Ludwig', 'Thomas', 'Sebastian', 'Michael', 'Johannes', 'Matthias', 'Joseph'];
    let randomMaps = ['Custom 5x5', 'Custom 10x10', 'Custom 15x15', 'Custom'];
    let randomMapUrls = [
      'https://www.researchgate.net/publication/344758433/figure/fig1/AS:948581901033472@1603170957252/An-example-of-a-map-configuration-for-Settlers-of-Catan.jpg',
      'https://scotscoop.com/wp-content/uploads/2020/06/IMG_2228-900x733.jpg',
      'https://i.stack.imgur.com/VWCy7.jpg'

    ]
    for(let i = 0; i < 10; i++) {
      servers.push({
        id: i.toString(),
        name: randomNames[Math.floor(Math.random() * randomNames.length)] +' Server',
        players: Math.floor(Math.random() * 10),
        maxPlayers: Math.floor(Math.random() * 10),
        passwordProtected: Math.random() > 0.5,
        isIngame: Math.random() > 0.5,
        mapName: randomMaps[Math.floor(Math.random() * randomMaps.length)],
        mapImageUrl: randomMapUrls[Math.floor(Math.random() * randomMapUrls.length)]
      });
    }
    return servers;
  }

}
