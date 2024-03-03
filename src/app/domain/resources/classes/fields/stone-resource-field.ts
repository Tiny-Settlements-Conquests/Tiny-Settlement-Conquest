import { Field } from "../../../playground/domain/classes/field";
import { ResourceField } from "../../models/resource-field.model";
import { Resource } from "./resource-field";

export class StoneResourceField extends Resource implements ResourceField {
  public readonly typ ='iron';
  public readonly color = '#4C5270';

  constructor(
    public readonly field: Field,
    public readonly value: number
    ) { 
    super()
    this._image.src = "/assets/images/stone.png";
  }

}
