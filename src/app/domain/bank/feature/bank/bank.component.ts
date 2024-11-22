import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';
import { BankRepository } from '../../domain/state/bank.repository';

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
  private readonly _bankRepository = inject(BankRepository);
  
  public readonly bankInventory = toSignal(
    this._bankRepository.selectInventory()
  )

}
