import { Field } from "../../../playground/domain/classes/field";
import { PlaygroundDimensions } from "../../../playground/domain/models/playground.model";
import { ResourceField } from "../../../resources/domain/models/resource-field.model";
import { User } from "../../../user/domain/models/user.model";

export interface MapInformation {
    id: string;
    name: string;
    createdAt: Date;
    creator: User;
    seed: string | null;
    previewUrl: string
    playgroundInformation: MapPlaygroundInformation
}

export interface MapPlaygroundInformation {
    dimensions: PlaygroundDimensions
    fields: Field[],
    resourceFields: ResourceField[],
}