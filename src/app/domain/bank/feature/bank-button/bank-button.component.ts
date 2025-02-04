import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal, ViewContainerRef } from '@angular/core';
import { BankStore } from '../../domain/state/bank.store';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';

@Component({
  selector: 'app-bank-button',
  imports: [
    OverlayModule,
    ActionCardStackComponent
  ],
  hostDirectives: [
    CdkOverlayOrigin
  ],
  templateUrl: './bank-button.component.html',
  styleUrl: './bank-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankButtonComponent {
    private readonly _bankStore = inject(BankStore);
    
    public readonly bankInventory = this._bankStore.resources;

    elementRef = inject(ElementRef);

    public readonly isOpen = signal(false);

    @HostListener('click')
    toggle() {
      this.isOpen.set(!this.isOpen());
    }
}
