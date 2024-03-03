import { Field } from "../../../playground/domain/classes/field";
import { ResourceField } from "../../models/resource-field.model";
import { Resource } from "./resource-field";

export class BrickResourceField extends Resource implements ResourceField {
  public readonly typ ='clay';
  public readonly color = '#C38370';

  constructor(
    public readonly field: Field,
    public readonly value: number
  ) { 
    super();
    this._image.src = "/assets/images/brick.png";
  }

}
