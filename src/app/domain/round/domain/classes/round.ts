import { BehaviorSubject } from "rxjs";
import { Player } from "../../../player/domain/classes/player";

export class Round {
  private readonly _playersUpdate = new BehaviorSubject<Player[]>([]);

  private _activePlayer = new BehaviorSubject<Player | null>(null);
  private _roundNumber: number = 0;
  private _activePlayerIndex: number = 0;

  public get roundNumber(): number {
    return this._roundNumber;
  }

  public get activePlayer(): Player | null {
    return this._activePlayer.value;
  }

  public get players(): Player[] {
    return this._players;
  }

  public selectActivePlayer(){
    return this._activePlayer;
  }

  public selectRoundPlayers() {
    return this._playersUpdate;
  }

  public getPlayerById(id: string): Player | null {
    return this._players.find(player => player.id === id) || null;
  }

  constructor(
    private _players: Player[], 
  ) {
    this._activePlayer.next(this.players[1])
    this._playersUpdate.next(this.players);
  }

  public setActivePlayerIndex(index: number) {
    this._activePlayerIndex = index;
    this._activePlayer.next(this._players[index]);
  }

  public setActivePlayerById(id: string) {
    const idx = this._players.findIndex(player => player.id === id);
    if(idx === -1) return;
    this._activePlayerIndex = idx;
    this._activePlayer.next(this._players[idx]);
  }

  public next() {
    let activeRoundPlayer = this.activePlayer;
    if(!activeRoundPlayer) {
      activeRoundPlayer = this.players[0];
    }

    const roundPlayers = this.players;
    const activeIndex = roundPlayers.indexOf(activeRoundPlayer);
    let nextIndex = activeIndex + 1;
    if(nextIndex >= roundPlayers.length) {
      nextIndex = 0;
    }
    this._activePlayer.next(roundPlayers[nextIndex]);
    this._activePlayerIndex = nextIndex;
  }



}
