import { Graph } from "../../../graph/domain/classes/graph";
import { Field } from "../../../playground/domain/classes/field";
import { GridDimensions } from "../models/grid.model";
import { GridField } from "./grid-field";

export class Grid {

  constructor(
    private readonly _dimensions: GridDimensions,
    private readonly _fields: Field[],
    private readonly _gridGraph: Graph,
    private readonly _gridFields: GridField[],
  ) { }
  
  public get fields(): Field[] {
    return this._fields;
  }

  public get gridGraph(): Graph {
    return this._gridGraph;
  }

  public get gridFields(): GridField[] {
    return this._gridFields;
  }

  public get width(): number {
    return this._dimensions.gridWidth;
  }

  public get height(): number {
    return this._dimensions.gridHeight;
  }

}
