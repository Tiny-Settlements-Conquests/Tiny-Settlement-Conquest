import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BackArrowComponent } from '../../domain/layouts/ui/back-arrow/back-arrow.component';
import { RouterLink } from '@angular/router';
import { MapPreviewComponent } from '../../domain/game/feature/map-preview/map-preview.component';
import { faCalendarDays, faMaximize, faSeedling, faUser } from '@fortawesome/free-solid-svg-icons';
import { MapCardTableComponent } from '../../domain/map-selection/feature/map-card-table/map-card-table.component';

@Component({
  selector: 'app-map-selection',
  standalone: true,
  imports: [
    TitleComponent,
    FaIconComponent,
    BackArrowComponent,
    RouterLink,
    MapPreviewComponent,
    FaIconComponent,
    MapCardTableComponent
  ],
  templateUrl: './map-selection.component.html',
  styleUrl: './map-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapSelectionComponent { 
  public icons = {
    seed: faSeedling,
    calendar: faCalendarDays,
    user: faUser,
    size: faMaximize
  }
}
