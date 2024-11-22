import { ActionCardMode } from "../../../cards/domain/models/action-card.model"
import { ResourceType } from "./resources.model"

export type ResourceCard = {
    typ: ResourceType,
    imageUrl: string,
    cardMode: ActionCardMode
}
