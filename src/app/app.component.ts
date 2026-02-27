import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserStore } from '@catan/core';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly _userStore = inject(UserStore)

  ngOnInit() {
    this._userStore.setUser({
      name: 'Player',
      profileUrl: 'assets/avatars/robot_3.png',
      id: '2',
    })
  }
}
