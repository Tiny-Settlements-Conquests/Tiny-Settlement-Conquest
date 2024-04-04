import { CommonModule, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { ActionCardComponent, ActionCardMode } from '../action-card/action-card.component';

@Component({
  selector: 'app-action-card-side-stack',
  standalone: true,
  imports: [
    ActionCardComponent,
    NgStyle
  ],
  templateUrl: './action-card-side-stack.component.html',
  styleUrl: './action-card-side-stack.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionCardSideStackComponent { 
  private readonly _count = signal(0);
  
  
  @Input()
  public set count(v: number){
    this._count.set(v);
  }

  public get count(){
    return this._count();
  }

  private readonly _countArray = computed(() => {
    // - 1 because we have one display card which doesnt count!
    if(this.count === 0) return [];
    return new Array(this.count - 1).fill(0);
  })

  public get countArray() {
    return this._countArray();
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
