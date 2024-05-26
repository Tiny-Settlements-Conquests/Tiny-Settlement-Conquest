import { Field } from "../../../../playground/domain/classes/field";
import { ResourceField } from "../../models/resource-field.model";
import { Resource } from "./resource-field";

export class StoneResourceField extends Resource implements ResourceField {
  public readonly typ ='stone';
  public readonly color = '#94a3b8';

  constructor(
    public readonly field: Field,
    public readonly value: number
    ) { 
    super()
    this.resourceImage.src = "/assets/images/stone.png";
  }

}
