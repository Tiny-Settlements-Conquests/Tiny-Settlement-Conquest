import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { asapScheduler } from 'rxjs';
import { GAME_PRELOAD_IMAGE_MAP } from '../../domain/models/image-preloader.model';
import { preloadImageItems } from '../../domain/utils/image-preloader.utils';
import { LoadingBarComponent } from '../../ui/loading-bar/loading-bar.component';

@Component({
    selector: 'app-game-loader',
    imports: [
        LoadingBarComponent,
    ],
    templateUrl: './game-loader.component.html',
    styleUrl: './game-loader.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameLoaderComponent {
  private readonly router = inject(Router)

  public progress = toSignal(
    preloadImageItems(GAME_PRELOAD_IMAGE_MAP) // todo besser als repo dann kann man auch einfacher prüfen ob bereits geladen wurde
  )

  public readonly _progressWatch = effect(() => {
    const progress = this.progress();
    if(progress?.progress !== undefined && progress.progress === 100) {
      asapScheduler.schedule(() => {
        this.router.navigate(['/game']);
      }, 2000)
    }
  })
}
