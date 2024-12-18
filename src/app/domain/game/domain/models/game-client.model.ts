import { ViewContainerRef, DestroyRef } from "@angular/core";
import { ActionHistoryRepository } from "../../../action-history/domain/state/action-history.repository";
import { BankRepository } from "../../../bank/domain/state/bank.repository";
import { DiceRepository } from "../../../dice/domain/state/dice.repository";
import { InventoryRepository } from "../../../inventory/domain/state/inventory.repository";
import { EventQueueRepository } from "../../../response-queue/domain/state/event-queue.repository";
import { RoundPlayerRepository } from "../../../round/domain/state/round-players.repository";
import { TradeRepository } from "../../../trade/domain/state/trade.repository";
import { UserRepository } from "../../../user/domain/state/user.repository";
import { GameModeRepository } from "../state/game-mode.repository";

export interface GameClientDependencies {
    gameComponentRef: ViewContainerRef,
    bankRepository: BankRepository,
    inventoryRepository: InventoryRepository,
    roundPlayerRepository: RoundPlayerRepository,
    userRepository: UserRepository,
    gameModeRepository: GameModeRepository,
    diceRepository: DiceRepository,
    actionHistoryRepository: ActionHistoryRepository,
    tradeRepository: TradeRepository,
    eventQueueRepository: EventQueueRepository,
    destroyRef: DestroyRef,
}