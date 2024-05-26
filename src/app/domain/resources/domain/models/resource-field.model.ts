import { Field } from "../../../playground/domain/classes/field";

export type ResourceType = 'stone' | 'wool' | 'bricks' | 'wood' | 'straw';

export interface ResourceField {
    typ: ResourceType
    color: string
    field: Field
    value: number
    resourceImage: HTMLImageElement
    resourceValueImage: HTMLImageElement
    resourceBackgroundImage: HTMLImageElement
}

export type ResourceCard = {
    typ: ResourceType,
    imageUrl: string
}
