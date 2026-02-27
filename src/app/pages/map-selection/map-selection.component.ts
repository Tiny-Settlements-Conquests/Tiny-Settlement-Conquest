import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BackArrowComponent } from '../../domain/layouts/ui/back-arrow/back-arrow.component';
import { RouterLink } from '@angular/router';
import { MapPreviewComponent } from '../../domain/game/feature/map-preview/map-preview.component';
import { faCalendarDays, faMaximize, faSeedling, faUser } from '@fortawesome/free-solid-svg-icons';
import { MapCardTableComponent } from '../../domain/map-selection/feature/map-card-table/map-card-table.component';
import { LobbyStore } from '@catan/core';
import { DatePipe } from '@angular/common';
import { MapInformation } from '@catan/shared/models';

@Component({
    selector: 'app-map-selection',
    imports: [
        TitleComponent,
        FaIconComponent,
        BackArrowComponent,
        RouterLink,
        FaIconComponent,
        MapCardTableComponent,
        DatePipe
    ],
    templateUrl: './map-selection.component.html',
    styleUrl: './map-selection.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapSelectionComponent { 
  private readonly _lobbyStore = inject(LobbyStore);

  public icons = {
    seed: faSeedling,
    calendar: faCalendarDays,
    user: faUser,
    size: faMaximize
  }

  public selectedMapToPreview = signal<MapInformation |null>(null)

  public setSelectedMap(){
    const map = this.selectedMapToPreview();
    if(!map) return;
    this._lobbyStore.setMapData(map)
  }

  ngOnInit() {
    this.selectedMapToPreview.set(this._lobbyStore.getMapData())
  }
}
