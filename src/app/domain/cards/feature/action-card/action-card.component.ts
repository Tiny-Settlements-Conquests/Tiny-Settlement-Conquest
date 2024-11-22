import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActionCardMode } from '../../domain/models/action-card.model';


@Component({
  selector: 'app-action-card',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './action-card.component.html',
  styleUrl: './action-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionCardComponent { 

  private readonly _count = signal(0);

  @Input()
  set count(v: number) {
    this._count.set(v);
  }

  public get count() {
    return this._count();
  }

  private readonly _mode = signal<ActionCardMode>('blue');


  @Input()
  set mode(v: ActionCardMode) {
    this._mode.set(v);
  }

  @HostBinding('class')
  get modeClass() { return this._mode(); }
}
