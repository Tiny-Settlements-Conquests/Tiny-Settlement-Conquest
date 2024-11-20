import { Routes } from '@angular/router';
import { GameMapGuardService } from './domain/game/domain/services/game-map-guard.service';

export const routes: Routes = [
    {
        pathMatch: 'full',
        path: '',
        redirectTo: 'lobby'
    },
    { 
        path: '',  loadComponent : () => import('./domain/layouts/ui/default-layout/').then(m => m.DefaultLayoutComponent),
        children: [
            { 
                path: 'lobby', 
                loadComponent : () => import('./pages/lobby/').then(m => m.LobbyComponent),
            },
            {
                path: 'map-selection', 
                loadComponent : () => import('./pages/map-selection/').then(m => m.MapSelectionComponent)
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
        ],
        
    },
    
];
