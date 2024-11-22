import { ChangeDetectionStrategy, Component, HostBinding, HostListener, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMaximize, faUser } from '@fortawesome/free-solid-svg-icons';
import { MapInformation } from '../../domain/models/map-selection.model';

@Component({
  selector: 'app-map-card',
  standalone: true,
  imports: [
    FaIconComponent,
  ],
  templateUrl: './map-card.component.html',
  styleUrl: './map-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapCardComponent { 
  public icons = {
    user: faUser,
    size: faMaximize
  }
  public map = input.required<MapInformation>()

  public readonly active = input<boolean>(false)
  @HostBinding('class.active')
  get isActive() {
    return this.active() === true;
  }
}
