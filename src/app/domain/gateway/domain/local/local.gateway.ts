import { inject } from "@angular/core";
import { ResponseQueueRepository } from "../../../response-queue/domain/state/response-queue.repository";

export class LocalGateway {
    private readonly _responseQueue = inject(ResponseQueueRepository);
    

    public publish(event: string, data: any) {
        console.log(event, data);
        this._responseQueue.addResponse({
            id: Math.random().toString(),
            type: 'trade-offer-open',
            data
        });
    }
}