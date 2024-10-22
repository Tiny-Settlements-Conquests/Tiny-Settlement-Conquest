import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-trade-button',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './trade-button.component.html',
  styleUrl: './trade-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeButtonComponent { }
