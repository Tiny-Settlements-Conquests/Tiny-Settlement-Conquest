import { BehaviorSubject, Observable, Subject, map, tap } from "rxjs";
import { Player } from "../../../player/domain/classes/player";

export class Round {
  private readonly _playersUpdate = new BehaviorSubject<Player[]>([]);

  private readonly _activePlayer = new BehaviorSubject<Player | null>(null);
  private readonly _roundNumber = new BehaviorSubject(0);
  private readonly _roundEnd = new Subject();
  private _activePlayerIndex = 0;

  public get roundNumber(): Observable<number> {
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

  public getActivePlayer() {
    return this._activePlayer;
  }

  public getPlayerById(id: string): Player | null {
    return this._players.find(player => player.id === id) || null;
  }

  public get activePlayerIndex() {
    return this._activePlayerIndex;
  }

  public getPlayerByIndex(idx: number) {
    const player = this._players[idx];
    if(!player) throw new Error('Index does not exist');
    return player
  }

  constructor(
    private readonly _players: Player[], 
  ) {
    this._activePlayer.next(this.players[1])
    this._playersUpdate.next(this.players);
  }

  public selectRound() {
    return this._roundNumber.pipe(
      map((iteration) => ({
        iteration,
        activePlayer: this.activePlayer
      }),
      tap(() => console.log("YYYYYYY")))
    )
  }

  public selectRoundEnd() {
    return this._roundEnd
  }


  public setNewRound(playerId: string) {
    this._roundNumber.next(this._roundNumber.value + 1);
    const idx = this._players.findIndex(({id})=> id === playerId);
    if(idx === -1) return;
    this._activePlayerIndex = idx;
    this._activePlayer.next(this._players[idx]);
    this._roundEnd.next(true);
  }
}
