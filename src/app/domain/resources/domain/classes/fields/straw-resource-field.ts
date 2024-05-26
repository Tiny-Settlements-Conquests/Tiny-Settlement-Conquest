import { Field } from "../../../../playground/domain/classes/field";
import { ResourceField } from "../../models/resource-field.model";
import { Resource } from "./resource-field";

export class StrawResourceField extends Resource implements ResourceField{
  public readonly typ ='straw';
  public readonly color = '#ebb418';

  constructor(
    public readonly field: Field,
    public readonly value: number
  ) { 
    super()
    this.resourceImage.src = "/assets/images/wheat.png";
    this.resourceBackgroundImage.src = "/assets/terrain/sand.png";
  }
}
