import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent, colors } from '../../../button/button/button.component';

@Component({
    selector: 'app-back-arrow',
    imports: [
        FaIconComponent,
        ButtonComponent
    ],
    templateUrl: './back-arrow.component.html',
    styleUrl: './back-arrow.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackArrowComponent { 
  public readonly arrowLeft = faArrowLeft;
  public readonly color = input.required<colors>()
}
