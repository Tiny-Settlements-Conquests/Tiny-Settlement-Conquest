import { Provider } from "@angular/core";
import { Edition, ENVIRONMENT } from "../../../../../env/environment";
import { RemoteGateway } from "../remote/remote.gateway";

// export function provideGateway(): Provider {
//     if (ENVIRONMENT.edition === Edition.SINGLEPLAYER ) {
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