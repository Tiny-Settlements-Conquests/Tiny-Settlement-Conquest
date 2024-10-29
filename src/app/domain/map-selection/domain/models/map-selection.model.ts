import { GridDimensions } from "../../../grid/domain/models/grid.model";
import { User } from "../../../user/domain/models/user.model";

export interface SavedMap {
    id: string;
    name: string;
    dimensions: GridDimensions
    createdAt: Date;
    creator: User;
    seed: string | null;
    previewUrl: string
}