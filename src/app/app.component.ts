import { Component, ViewContainerRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserRepository } from './domain/user/domain/state/user.repository';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly _ref = inject(ViewContainerRef)
  private readonly _userRepository = inject(UserRepository)

  ngOnInit() {
    this._userRepository.setUser({
      name: 'Player',
      profileUrl: 'assets/avatars/robot_3.png',
      id: '2',
    })
  }
}
