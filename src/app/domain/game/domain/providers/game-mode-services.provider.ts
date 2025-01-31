import { Provider } from "@angular/core";
import { Edition, ENVIRONMENT } from "../../../../../env/environment";
import { SingleplayerServices } from "../services/singleplayer.services";
import { MultiplayerServices } from "../services/multiplayer.services";
import { GAME_MODE_SERVICE_LOADER_TOKEN } from "../tokens/game-mode-service-loader.token";

export function provideGameModeSpecificServices(): Provider {
    const edition = ENVIRONMENT.edition;
    if(edition === Edition.SINGLEPLAYER ) {
        console.log("WWED")
        return {
            provide: GAME_MODE_SERVICE_LOADER_TOKEN,
            useClass: SingleplayerServices
        }
    } 
    return {
        provide: GAME_MODE_SERVICE_LOADER_TOKEN,
        useClass: MultiplayerServices
    }
}