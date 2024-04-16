import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';

@Component({
  selector: 'app-action-history',
  standalone: true,
  imports: [
    BlockComponent, CommonModule 
  ],
  templateUrl: './action-history.component.html',
  styleUrl: './action-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionHistoryComponent { 
  historyArray: string[] = [];

  constructor(){
      for (let index = 0; index < 5; index++) {
        this.handleTestHistoryClick();
      }
  }

  handleTestHistoryClick(){
    this.historyArray.push('Test' + this.historyArray.length);
  }

  handleClearHistoryClick(){
    this.historyArray = [];
  }
}
