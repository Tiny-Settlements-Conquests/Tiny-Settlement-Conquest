import { Field } from "../../../playground/domain/classes/field";
import { PlaygroundGraphGenerator } from "../../../playground/domain/generators/playground-graph-generator";
import { Grid } from "../classes/grid";
import { GridDimensions } from "../models/grid.model";

export class GridGenerator {

  constructor() { }

  public generateGrid(dimensions: GridDimensions, fields: Field[]): any {
    const generator = new PlaygroundGraphGenerator();

    
  }
}
