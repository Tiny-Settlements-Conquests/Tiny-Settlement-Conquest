import { inject } from "@angular/core";
import { ResponseQueueRepository } from "../../../response-queue/domain/state/response-queue.repository";
import { GatewayEvents } from "../models/gateway.model";

export class LocalGateway {
    private readonly _responseQueue = inject(ResponseQueueRepository);
    

    public publish(event: GatewayEvents, data: any) {
        console.log(event, data);
        this._responseQueue.addResponse({
            id: Math.random().toString(),
            type: event,
            data
        });
    }
}