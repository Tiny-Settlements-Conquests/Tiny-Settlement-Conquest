import { Player } from "../../../player/domain/classes/player";

export class Round {
  private _activePlayer: Player | null = null;
  private _roundNumber: number = 0;
  private _activePlayerIndex: number = 0;

  public get roundNumber(): number {
    return this._roundNumber;
  }

  public get activePlayer(): Player | null {
    return this._activePlayer;
  }

  public get players(): Player[] {
    return this._players;
  }

  constructor(
    private readonly _players: Player[], 
  ) { }

    public setActivePlayerIndex(index: number) {
      this._activePlayerIndex = index;
      this._activePlayer = this._players[index];
    }

    public setActivePlayerById(id: string) {
      const idx = this._players.findIndex(player => player.id === id);
      if(idx === -1) return;
      this._activePlayerIndex = idx;
      this._activePlayer = this._players[idx];
    }



}
