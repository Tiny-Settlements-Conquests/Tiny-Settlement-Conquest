import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PauseResumeButtonComponent } from "../pause-resume-button/pause-resume-button.component";

@Component({
  selector: 'app-pause-overlay',
  imports: [PauseResumeButtonComponent],
  templateUrl: './pause-overlay.component.html',
  styleUrl: './pause-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PauseOverlayComponent {

}
