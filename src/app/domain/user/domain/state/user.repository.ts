import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { map } from 'rxjs';
import { User } from '../models/user.model';

const userStore = createStore(
    { name: 'user' },
    withProps<{user: User | undefined}>({ user: undefined})
);

@Injectable(
  { providedIn: 'root' }
)
export class UserRepository {
  public setUser(user: User) {
    userStore.update(state => ({user}))
  }

  public selectUser() {
    return userStore.pipe(map(({user}) => user))
  }

  public getUser() {
    return userStore.query(state => state.user)
  }
}
