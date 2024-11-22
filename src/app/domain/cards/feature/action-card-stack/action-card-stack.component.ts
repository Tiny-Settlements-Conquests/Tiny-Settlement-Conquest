import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { ActionCardComponent } from '../action-card/action-card.component';
import { ActionCardMode } from '../../domain/models/action-card.model';

@Component({
  selector: 'app-action-card-stack',
  standalone: true,
  imports: [
    ActionCardComponent
  ],
  templateUrl: './action-card-stack.component.html',
  styleUrl: './action-card-stack.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionCardStackComponent { 
  private readonly _count = signal(0);
  
  @Input()
  public set count(v: number){
    this._count.set(v);
  }

  public get count(){
    return this._count();
  }

  private readonly _mode = signal<ActionCardMode>('blue');
  @Input()
  public set mode(v: ActionCardMode){
    this._mode.set(v);
  }
  public get mode(){
    return this._mode();
  }
}
