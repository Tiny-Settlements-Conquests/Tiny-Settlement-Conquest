import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { TitleComponent } from '../../../layouts/ui/title/title.component';

export interface Resource {
  amount: number;
  url: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-resource-cards',
  standalone: true,
  imports: [
    BlockComponent,
    TitleComponent
  ],
  templateUrl: './resource-cards.component.html',
  styleUrl: './resource-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCardsComponent { 
  public resources = signal<Resource[]>([
    {
      amount: 1,
      url: 'assets/images/wood.png',
      name: 'Wood',
      color: '#81B622'
    }, {
      amount: 5,
      url: 'assets/images/brick.png',
      name: 'Brick',
      color: '#C38370'
    }, {
      amount: 2,
      url: 'assets/images/stone.png',
      name: 'Stone',
      color: '#4C5270'
    }, {
      amount: 3,
      url: 'assets/images/sheep.png',
      name: 'Sheep',
      color: '#DBE8D8'
    }, {
      amount: 0,
      url: 'assets/images/wheat.png',
      name: 'Wheat',
      color: '#FDB750'
    }
  ]);
}
