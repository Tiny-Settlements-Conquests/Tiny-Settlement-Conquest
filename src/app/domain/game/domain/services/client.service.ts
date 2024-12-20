import { inject, Injectable } from '@angular/core';
import { GAME_EVENT_DISPATCHER } from '../../../event-queues/domain/providers/game-event-dispatcher.provider';
import { EVENT_GATEWAY } from '../../../event-queues/domain/providers/event-gateway.provider';
import { EventQueueRepository } from '../../../event-queues/domain/state/event-queue/event-queue.repository';
import { GameEventQueueRepository } from '../../../event-queues/domain/state/game-event/game-event-queue.repository';

@Injectable({
  providedIn: 'any'
})
export class ClientService {
  public readonly eventGateway = inject(EVENT_GATEWAY);
  private readonly _eventQueueRepository = inject(EventQueueRepository);
  private readonly _gameEventQueueRepository = inject(GameEventQueueRepository);


  constructor() {
    //todo bei spielende unsubscriben, bzw. nen notifier service bauen
    this._eventQueueRepository.selectLatestResponse().subscribe((t) => {
      this.eventGateway.handle(t);
    })
    this._gameEventQueueRepository.selectLatestResponse().subscribe((t) => {
      // this.eventDispatcher.handle(t);
    })
    // this.eventDispatcher.

  }
}
