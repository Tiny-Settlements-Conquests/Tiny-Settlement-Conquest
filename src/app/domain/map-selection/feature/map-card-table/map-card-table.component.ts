import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MapSelectionService } from '../../domain/services/map-selection.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MapCardComponent } from '../../ui/map-card/map-card.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { startWith, switchMap } from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-map-card-table',
  standalone: true,
  imports: [
    MapCardComponent,
    ReactiveFormsModule,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './map-card-table.component.html',
  styleUrl: './map-card-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapCardTableComponent { 
  private readonly mapSelectionService = inject(MapSelectionService);
  private readonly _fb = inject(FormBuilder);

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


}
