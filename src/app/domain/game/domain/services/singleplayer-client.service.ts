import { inject, Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { BotSyncService } from '../../../bot/domain/services/bot-sync.service';

@Injectable({
  providedIn: 'any'
})
export class SingleplayerClientService extends ClientService {
  private readonly _botSyncService = inject(BotSyncService);


}
