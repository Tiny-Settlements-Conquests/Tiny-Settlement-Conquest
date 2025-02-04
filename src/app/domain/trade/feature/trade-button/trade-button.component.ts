import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-trade-button',
    imports: [
    ],
    templateUrl: './trade-button.component.html',
    styleUrl: './trade-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeButtonComponent { }
