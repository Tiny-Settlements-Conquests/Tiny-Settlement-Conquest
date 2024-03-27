import { Field } from "../../../playground/domain/classes/field";
import { ResourceField } from "../../models/resource-field.model";
import { Resource } from "./resource-field";

export class WoodResourceField extends Resource implements ResourceField{
  public readonly typ ='wood';
  public readonly color = '#15803d';

  constructor(
    public readonly field: Field,
    public readonly value: number
  ) {  
    super();
    this._image.src = "/assets/images/wood.png";
  }
}
