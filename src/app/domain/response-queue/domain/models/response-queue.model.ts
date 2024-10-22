import { GatewayEvents } from "../../../gateway/domain/models/gateway.model";


export interface ResponseQueueItem {
    id: string;
    type: GatewayEvents;
    data: any;
}