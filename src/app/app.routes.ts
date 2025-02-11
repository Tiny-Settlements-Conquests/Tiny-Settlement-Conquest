import { Routes } from '@angular/router';
import { GameMapGuardService } from './domain/game/domain/services/game-map-guard.service';

export const routes: Routes = [
    {
        pathMatch: 'full',
        path: '',
        redirectTo: 'menu'
    },
    { 
        path: '',  loadComponent : () => import('./domain/layouts/ui/parallax-layout/').then(m => m.ParallaxLayoutComponent),
        children: [
            {
                path: 'menu',
                loadComponent : () => import('./pages/menu/').then(m => m.MenuComponent),
            },
            { 
                path: 'lobby', 
                loadComponent : () => import('./pages/lobby/').then(m => m.LobbyComponent),
            },
            {
                path: 'map-selection', 
                loadComponent : () => import('./pages/map-selection/').then(m => m.MapSelectionComponent)
            }, 
            {
                path: 'updatelog',
                loadComponent : () => import('./pages/updatelog/').then(m => m.UpdatelogComponent)
            }
        ]
    },
    { 
        path: 'game',  loadComponent : () => import('./domain/layouts/ui/game-layout/').then(m => m.GameLayoutComponent),
        children: [
            { 
                path: '', loadComponent : () => import('./pages/game/').then(m => m.GameComponent),
                canActivate: [GameMapGuardService],
            },
            { 
                path: 'leaderboard', loadComponent : () => import('./pages/leaderboard/').then(m => m.LeaderboardComponent),
                canActivate: [GameMapGuardService],
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'menu'
    }
    
];
