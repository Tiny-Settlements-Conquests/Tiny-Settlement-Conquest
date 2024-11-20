import { Subject } from "rxjs";
import { rollDices } from "../functions/roll-dice.function";
import { RolledDices } from "../models/dice.model";

export class DiceRoller {
    private readonly _rolledDice = new Subject<[number, number]>();
    private _hasRolledThisRound = false;
  
    public rollDices(): RolledDices {
      if (this._hasRolledThisRound) throw new Error();
      const dices = rollDices();
      this._rolledDice.next(dices);
      const [valueOne, valueTwo] = dices;
      const value = valueOne + valueTwo;
      this._hasRolledThisRound = true;
      return {
        dice1: valueOne,
        dice2: valueTwo,
        sum: value
      }
    }

    public get hasRolledThisRound(): boolean {
      return this._hasRolledThisRound;
    }
  
    public selectRolledDice(): Subject<[number, number]> {
      return this._rolledDice;
    }
  
    public resetRoll(): void {
      this._hasRolledThisRound = false;
    }
  }