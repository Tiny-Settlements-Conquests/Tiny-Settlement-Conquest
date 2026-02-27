import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, signal, ViewContainerRef } from '@angular/core';
import { GameFacade } from '@catan/feature-game';
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
    private readonly _facade = inject(GameFacade);
    
    public readonly bankInventory = this._facade.bankResources;

    elementRef = inject(ElementRef);

    public readonly isOpen = signal(false);

    @HostListener('click')
    toggle() {
      this.isOpen.set(!this.isOpen());
    }

}
