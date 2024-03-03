import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'servers',
        pathMatch: 'full'
    },
    {
        path: 'lobby/:gameId',
        loadComponent() {
            return import('./domain/layouts/ui/default-layout/').then(m => m.DefaultLayoutComponent);
        },
        children: [
            {
                path: '',
                loadComponent() {
                    return import('./pages/lobby/').then(m => m.LobbyComponent);
                },
            }
        ]
    },
    {
        path: 'servers',
        loadComponent() {
            return import('./domain/layouts/ui/default-layout/').then(m => m.DefaultLayoutComponent);
        },
        children: [
            {
                path: '',
                loadComponent() {
                    return import('./pages/server-list/').then(m => m.ServerListComponent);
                },
            }
        ]
        
    },
    {
        path: 'game/:gameId',
        loadComponent() {
            return import('./domain/layouts/ui/game-layout/').then(m => m.GameLayoutComponent);
        },
        children: [
            {
                path: '',
                loadComponent() {
                    return import('./pages/game/').then(m => m.GameComponent);
                },
            }
        ]
    }
];
