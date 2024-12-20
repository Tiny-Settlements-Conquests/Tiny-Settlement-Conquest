export interface QueueItem<ParamsMap, EventType extends keyof ParamsMap> {
        id: string;
        type: EventType;
        data: ParamsMap[EventType];
}

export function isTypeofEvent<
    ParamsMap, 
    EventType extends keyof ParamsMap = keyof ParamsMap, 
    T extends QueueItem<ParamsMap, EventType> = QueueItem<ParamsMap, EventType>
>(type: EventType, event: T): event is T {
    return event.type === type;
}