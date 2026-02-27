import { Provider } from "@angular/core";
import { Edition, environment } from '@catan/core';
import { RemoteGateway } from "../remote/remote.gateway";

// export function provideGateway(): Provider {
//     if (environment.edition === Edition.SINGLEPLAYER ) {
//         return {
//             // provide: GATEWAY_TOKEN,
//             // useClass: LocalGateway,
//         }
//     }

//     return {
//         // provide: GATEWAY_TOKEN,
//         useClass: RemoteGateway,
//     }
// }