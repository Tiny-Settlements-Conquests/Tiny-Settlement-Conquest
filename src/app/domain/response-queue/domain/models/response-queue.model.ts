export type ResponseType = 'trade-offer-open' | 'trade-accept' | 'trade-reject';

export interface ResponseQueueItem {
    id: string;
    type: ResponseType;
    data: any;
}