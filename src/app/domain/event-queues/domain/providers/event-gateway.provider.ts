import { InjectionToken, Provider } from '@angular/core';
import { ENVIRONMENT, Edition } from '../../../../../env/environment';
import { EventGatewayService } from '../../services/event-gateway.service';
import { EventRestGatewayService } from '../../services/event-rest-gateway.service';
import { EventGateway } from '../models/event-gateway.model';


export const EVENT_GATEWAY = new InjectionToken<EventGateway>('event_gateway');

export function provideEventGateway(): Provider {
    return {
        provide: EVENT_GATEWAY,
        useClass: ENVIRONMENT.edition === Edition.SINGLEPLAYER ? EventGatewayService : EventRestGatewayService
    }
}