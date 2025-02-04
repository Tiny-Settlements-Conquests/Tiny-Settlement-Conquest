import { inject, Injectable } from '@angular/core';
import { EVENT_GATEWAY } from '../../../event-queues/domain/providers/event-gateway.provider';
import { EventQueueRepository } from '../../../event-queues/domain/state/event-queue/event-queue.repository';

//extends either a singleplayer or a multiplayer client
export abstract class ClientService {
  public readonly eventGateway = inject(EVENT_GATEWAY);
  private readonly _eventQueueRepository = inject(EventQueueRepository);


  constructor() {
    //todo bei spielende unsubscriben, bzw. nen notifier service bauen
    this._eventQueueRepository.selectLatestResponse().subscribe((t) => {
      this.eventGateway.handle(t);
    })

  }
}
