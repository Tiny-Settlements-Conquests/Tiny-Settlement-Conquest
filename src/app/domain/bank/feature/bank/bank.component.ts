import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';
import { BankStore } from '../../domain/state/bank.store';

@Component({
  selector: 'app-bank',
  standalone: true,
  imports: [
    ActionCardStackComponent
  ],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankComponent { 
  private readonly _bankStore = inject(BankStore);
  
  public readonly bankInventory = this._bankStore.resources;

}
