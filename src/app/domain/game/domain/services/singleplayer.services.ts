import { inject, Injectable } from '@angular/core';
import { BotSyncService } from '../../../bot/domain/services/bot-sync.service';

@Injectable({
  providedIn: 'any'
})
export class SingleplayerServices {
    private readonly _botSyncService = inject(BotSyncService);
}
