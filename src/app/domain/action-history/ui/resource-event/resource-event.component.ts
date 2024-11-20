import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ResourceAction } from '../../domain/models/action.model';

@Component({
  selector: 'app-resource-event',
  standalone: true,
  templateUrl: './resource-event.component.html',
  styleUrl: './resource-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceEventComponent { 
  public readonly action = input.required<ResourceAction>()

}
