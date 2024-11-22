import { BehaviorSubject, Observable, Subject, filter, map, tap } from "rxjs";
import { Player } from "../../../player/domain/classes/player";
import { RoundInformation } from "../models/round.model";

export class Round {
  private readonly _playersUpdate = new BehaviorSubject<Player[]>([]);

  private readonly _round = new BehaviorSubject<RoundInformation | null>(null);
  private readonly _roundUpdate = this._round.pipe(
    filter((r) => r !== null)
  );
  private readonly _roundNumber = new BehaviorSubject(0);
  private readonly _roundEnd = new Subject();
  private _activePlayerIndex = 0;

  public get roundNumber(): Observable<number> {
    return this._roundNumber;
  }

  public get players(): Player[] {
    return this._players;
  }

  public selectActivePlayer(){
    return this._roundUpdate.pipe(
      map(({activePlayer}) => activePlayer)
    );
  }

  public selectRoundPlayers() {
    return this._playersUpdate;
  }

  public getActivePlayer(): Player | null {
    return this._round.value?.activePlayer ?? null;
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
    this._playersUpdate.next(this.players);
    this._round.next({
      activePlayer: this._players[0],
      roundNumber: 0
    })
  }

  public selectRound() {
    return this._roundUpdate.pipe(
      map(({activePlayer, roundNumber}) => ({
        iteration: roundNumber,
        activePlayer
      }),
    ))
  }

  public selectRoundEnd() {
    return this._roundEnd
  }


  public setNewRound(playerId: string) {
    const idx = this._players.findIndex(({id})=> id === playerId);
    if(idx === -1) return;
    this._activePlayerIndex = idx;
    this._round.next({
      activePlayer: this._players[idx],
      roundNumber: this._roundNumber.value + 1
    })
    this._roundEnd.next(true);
  }
}
