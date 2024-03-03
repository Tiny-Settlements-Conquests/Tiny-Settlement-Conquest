import { Field } from "../../playground/domain/classes/field";

export type ResourceType = 'iron' | 'wool' | 'clay' | 'wood' | 'straw';

export interface ResourceField {
    typ: ResourceType
    color: string
    field: Field
    value: number
    getImage(): HTMLImageElement
    getImageSrc(): string
}

