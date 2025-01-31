import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { map, startWith, switchMap } from 'rxjs';
import { LobbyRepository } from '../../../lobby/domain/state/repository';
import { MapInformation } from '../../domain/models/map-selection.model';
import { MapSelectionService } from '../../domain/services/map-selection.service';
import { MapCardComponent } from '../../ui/map-card/map-card.component';
import { MapSelectionComponent } from '../../../../pages/map-selection';

@Component({
  selector: 'app-map-card-table',
  standalone: true,
  imports: [
    MapCardComponent,
    ReactiveFormsModule,
    FormsModule,
    FaIconComponent,
  ],
  templateUrl: './map-card-table.component.html',
  styleUrl: './map-card-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapCardTableComponent {
  private readonly _lobbyRepository = inject(LobbyRepository);
  private readonly mapSelectionService = inject(MapSelectionService);
  private readonly _fb = inject(FormBuilder);
  private readonly mapSelectionComponent = inject(MapSelectionComponent);

  public readonly search = this._fb.control('');

  public readonly icons = {
    search: faMagnifyingGlass
  }

  private readonly _mapSearch$ = this.search.valueChanges.pipe(
    startWith(this.search.value)
  )

  public readonly maps = toSignal(
      this._mapSearch$.pipe(
        switchMap((value) => this.mapSelectionService.selectMaps(value))
      )
  );

  public setSelectedMap(map: MapInformation) {
    this.mapSelectionComponent.selectedMapToPreview.set(map);;
  }

 public readonly selectedMapId = this.mapSelectionComponent.selectedMapToPreview
}
