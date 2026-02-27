import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { User } from '@catan/shared/models';

interface UserState {
  user: User | undefined;
}

const initialState: UserState = {
  user: undefined,
};

/**
 * UserStore — Global singleton store for the current user.
 * Replaces the old Elf-based UserRepository.
 */
export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isLoggedIn: computed(() => store.user() !== undefined),
  })),
  withMethods((store) => ({
    setUser(user: User): void {
      patchState(store, { user });
    },
    getUser(): User | undefined {
      return store.user();
    },
    clearUser(): void {
      patchState(store, { user: undefined });
    },
  }))
);
