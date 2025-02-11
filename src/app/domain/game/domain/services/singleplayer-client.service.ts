import { inject, Injectable } from '@angular/core';
import { BotSyncService } from '../../../bot/domain/services/bot-sync.service';

@Injectable({
  providedIn: 'any'
})
export class SingleplayerClientService {
  private readonly _botSyncService = inject(BotSyncService); // ! do not remove this works via effects


}
