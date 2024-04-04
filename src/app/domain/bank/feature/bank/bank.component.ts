import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { ActionCardComponent } from '../../../cards/feature/action-card/action-card.component';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { BankRepository } from '../../domain/state/bank.repository';

@Component({
  selector: 'app-bank',
  standalone: true,
  imports: [
    BlockComponent,
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
