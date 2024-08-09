import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-winning-points-flag',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './winning-points-flag.component.html',
  styleUrl: './winning-points-flag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinningPointsFlagComponent { 
  public readonly color = input('red');
}
