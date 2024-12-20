import { ViewContainerRef, DestroyRef } from "@angular/core";
import { ActionHistoryRepository } from "../../../action-history/domain/state/action-history.repository";
import { BankRepository } from "../../../bank/domain/state/bank.repository";
import { DiceRepository } from "../../../dice/domain/state/dice.repository";
import { InventoryRepository } from "../../../inventory/domain/state/inventory.repository";
import { RoundPlayerRepository } from "../../../round/domain/state/round-players.repository";
import { TradeRepository } from "../../../trade/domain/state/trade.repository";
import { UserRepository } from "../../../user/domain/state/user.repository";
import { GameClientDependencies } from "../models/game-client.model";
import { GameModeRepository } from "../state/game-mode.repository";
import { EventQueueRepository } from "../../../event-queues/domain/state/event-queue/event-queue.repository";

export abstract class GameClient {
    protected _gameComponentRef: ViewContainerRef;
    protected _bankRepository: BankRepository;
    protected _inventoryRepository: InventoryRepository;
    protected _roundPlayerRepository: RoundPlayerRepository;
    protected _userRepository: UserRepository;
    protected _gameModeRepository: GameModeRepository;
    protected _diceRepository: DiceRepository;
    protected _actionHistoryRepository: ActionHistoryRepository;
    protected _tradeRepository: TradeRepository;
    protected _eventQueueRepository: EventQueueRepository;
    protected _destroyRef: DestroyRef;
    constructor(deps: GameClientDependencies){
        this._gameComponentRef = deps.gameComponentRef;
        this._bankRepository = deps.bankRepository;
        this._inventoryRepository = deps.inventoryRepository;
        this._roundPlayerRepository = deps.roundPlayerRepository;
        this._userRepository = deps.userRepository;
        this._gameModeRepository = deps.gameModeRepository;
        this._diceRepository = deps.diceRepository;
        this._actionHistoryRepository = deps.actionHistoryRepository;
        this._tradeRepository = deps.tradeRepository;
        this._eventQueueRepository = deps.eventQueueRepository;
        this._destroyRef = deps.destroyRef;
    }
}