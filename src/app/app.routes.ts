import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        pathMatch: 'full',
        path: '',
        redirectTo: 'home'
    },
    {
        path: 'home',
        loadComponent : () => import('./pages/home/').then(m => m.HomeComponent)
    },
    { 
        path: '',  loadComponent : () => import('./domain/layouts/ui/default-layout/').then(m => m.DefaultLayoutComponent),
        children: [
            { path: 'servers', loadComponent : () => import('./pages/server-list/').then(m => m.ServerListComponent)},
            { path: 'lobby/:gameId', loadComponent : () => import('./pages/lobby/').then(m => m.LobbyComponent)},
        ]
    },
    { 
        path: 'game/:gameId',  loadComponent : () => import('./domain/layouts/ui/game-layout/').then(m => m.GameLayoutComponent),
        children: [
            { path: '', loadComponent : () => import('./pages/game/').then(m => m.GameComponent)},
        ]
    },
    
];
