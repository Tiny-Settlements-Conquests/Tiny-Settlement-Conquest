import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    BlockComponent,
    FontAwesomeModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent { 
  public readonly icons = {
    paperPlane: faPaperPlane
  }
}
