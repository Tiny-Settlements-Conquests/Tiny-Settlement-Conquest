import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BuildAction } from '../../domain/models/action.model';

@Component({
  selector: 'app-build-event',
  standalone: true,
  imports: [
  ],
  templateUrl: './build-event.component.html',
  styleUrl: './build-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildEventComponent { 
  public readonly action = input.required<BuildAction>()
}
