import { Field } from "../../../../playground/domain/classes/field";
import { ResourceField } from "../../models/resource-field.model";
import { Resource } from "./resource-field";

export class BrickResourceField extends Resource implements ResourceField {
  public readonly typ ='bricks';
  public readonly color = '#e46c2c';

  constructor(
    public readonly field: Field,
    public readonly value: number
  ) { 
    super();
    this.resourceImage.src = "/assets/resources/brick.png";
  }

}
