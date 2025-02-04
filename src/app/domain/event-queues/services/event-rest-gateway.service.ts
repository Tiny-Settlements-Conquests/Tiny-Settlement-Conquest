import { Injectable } from '@angular/core';
import { EventQueueItem } from '../domain/models/event-queue.model';
import { BaseEventGateway } from './base-event-gateway';

@Injectable({
  providedIn: 'any'
})
export class EventRestGatewayService extends BaseEventGateway {

  handle(event: EventQueueItem): void {
    console.log("EVENT REST GATEWAY SERVICE  ")
      
  }

}
