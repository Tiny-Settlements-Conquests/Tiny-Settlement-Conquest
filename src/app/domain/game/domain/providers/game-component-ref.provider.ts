import { inject, Provider } from "@angular/core";
import { GAME_COMPONENT_REF_TOKEN } from "../tokens/game-component-ref.token";
import { AppComponent } from "../../../../app.component";

export function provideGameComponentRef(): Provider{
    return {
        provide: GAME_COMPONENT_REF_TOKEN,
        useFactory: () => {

            const component = inject(AppComponent);
            console.log("REF", component);
            return component._ref;
        }
    }
}