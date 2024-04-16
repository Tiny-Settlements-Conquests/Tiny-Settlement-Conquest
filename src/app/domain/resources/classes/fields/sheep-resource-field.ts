import { Field } from "../../../playground/domain/classes/field";
import { ResourceField } from "../../models/resource-field.model";
import { Resource } from "./resource-field";

export class SheepResourceField extends Resource implements ResourceField{
  public readonly typ ='wool';
  public readonly color = '#84cc16';

  constructor(
    public readonly field: Field,
    public readonly value: number
  ) { 
    super();
    this.resourceImage.src = "/assets/images/sheep.png";
  }
}
