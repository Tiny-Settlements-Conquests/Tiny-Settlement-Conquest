import { Provider } from "@angular/core";
import { Edition, environment } from '@catan/core';
import { SingleplayerClientService } from "../services/singleplayer-client.service";
import { GAME_CLIENT_EDITION_SERVICE_TOKEN } from "../tokens/game-client-edition-service.token";
import { MultiplayerClientServices } from "../services/multiplayer-client.service";
import { BotSyncService } from "../../../bot/domain/services/bot-sync.service";

export function provideGameClientEditionService(): Provider[] {
    const edition = environment.edition;
    if(edition === Edition.SINGLEPLAYER ) {
        return [
            BotSyncService,
            {
                provide: GAME_CLIENT_EDITION_SERVICE_TOKEN,
                useClass: SingleplayerClientService
            }
        ]
    } 
    return [{
        provide: GAME_CLIENT_EDITION_SERVICE_TOKEN,
        useClass: MultiplayerClientServices
    }]
}