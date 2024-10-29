import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-back-arrow',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './back-arrow.component.html',
  styleUrl: './back-arrow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackArrowComponent { 
  public readonly arrowLeft = faArrowLeft
}
