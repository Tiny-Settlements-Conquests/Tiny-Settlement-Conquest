import { computed, inject, Injectable } from '@angular/core';
import { EVENT_GATEWAY_TOKEN } from '@catan/core';
import { BuildingType, EventGateway, GameMode, TradeRequest, TradeResponse } from '@catan/shared/models';
import { GraphNode } from '@catan/game-engine';

import { InventoryStore } from '../state/inventory.store';
import { BankStore } from '../state/bank.store';
import { DiceStore } from '../state/dice.store';
import { RoundPlayerStore } from '../state/round-player.store';
import { RoundCountdownStore } from '../state/round-countdown.store';
import { GameModeStore } from '../state/game-mode.store';
import { GameStateStore } from '../state/game-state.store';
import { ActionHistoryStore } from '../state/action-history.store';
import { TradeStore } from '@catan/feature-trade';

/**
 * GameFacade — Single entry point for all game-related state and actions.
 * 
 * Components should inject this facade instead of individual stores or services.
 * This provides:
 * 1. A clean, stable API surface
 * 2. Decoupling of components from store implementation details
 * 3. Centralized action dispatching through the EventGateway
 * 
 * The facade delegates actions to the EventGateway (which may be local or remote),
 * and exposes readonly signals from the underlying stores.
 */
@Injectable()
export class GameFacade {
  private readonly gateway = inject(EVENT_GATEWAY_TOKEN);
  private readonly inventoryStore = inject(InventoryStore);
  private readonly bankStore = inject(BankStore);
  private readonly diceStore = inject(DiceStore);
  private readonly roundPlayerStore = inject(RoundPlayerStore);
  private readonly countdownStore = inject(RoundCountdownStore);
  private readonly gameModeStore = inject(GameModeStore);
  private readonly gameStateStore = inject(GameStateStore);
  private readonly actionHistoryStore = inject(ActionHistoryStore);
  private readonly tradeStore = inject(TradeStore);

  // --- Readonly State Signals ---

  /** Current player's resource inventory */
  readonly inventory = this.inventoryStore.resources;

  /** Bank's resource inventory */
  readonly bankResources = this.bankStore.resources;

  /** Current dice roll result (undefined if not rolled yet) */
  readonly dices = this.diceStore.dices;

  /** Whether the dice overlay should be shown */
  readonly isDiceOverlayOpen = this.diceStore.isOverlayOpen;

  /** All players in the current round */
  readonly roundPlayers = this.roundPlayerStore.entities;

  /** The currently active player */
  readonly activePlayer = this.roundPlayerStore.activeRoundPlayer;

  /** The current user's player data */
  readonly me = this.roundPlayerStore.me;

  /** Whether it's the current user's turn */
  readonly isMyTurn = this.roundPlayerStore.isMyTurn;

  /** All players except the current user */
  readonly otherPlayers = this.roundPlayerStore.roundPlayersExceptMe;

  /** Current round countdown in milliseconds */
  readonly countdown = this.countdownStore.countdownInMS;

  /** Whether the countdown has ended */
  readonly isCountdownEnded = this.countdownStore.isCountdownEnded;

  /** Current game interaction mode (spectate, road, town, city) */
  readonly gameMode = this.gameModeStore.mode;

  /** Overall game state (PLAY, PAUSE, END) */
  readonly gameState = this.gameStateStore.state;

  /** Complete action history log */
  readonly actionHistory = this.actionHistoryStore.entities;

  /** Active trade requests */
  readonly trades = this.tradeStore.entities;

  // --- Computed Signals ---

  readonly canBuild = computed(() => this.isMyTurn() && this.gameMode() !== 'spectate');

  // --- Actions (delegated to EventGateway) ---

  rollDice(): void {
    this.gateway.rollDice();
  }

  nextRound(): void {
    this.gateway.nextRound();
  }

  buildRoad(nodeA: GraphNode, nodeB: GraphNode): void {
    this.gateway.tryBuildRoadBetweenGraphNodes(nodeA, nodeB);
  }

  buildBuilding(node: GraphNode, type: BuildingType): void {
    this.gateway.tryBuildBuildingOnGraphNode(node, type);
  }

  startTrade(trade: TradeRequest): void {
    this.gateway.startTrade(trade);
  }

  respondToTrade(response: TradeResponse): void {
    this.gateway.respondToTrade(response);
  }

  pause(): void {
    this.gateway.pause();
  }

  resume(): void {
    this.gateway.resume();
  }

  // --- Mode changes (local-only, not gateway actions) ---

  setGameMode(mode: GameMode): void {
    this.gameModeStore.setMode(mode);
  }

  setDiceOverlayOpen(open: boolean): void {
    this.diceStore.setIsOverlayOpen(open);
  }

  setDices(dices: [number, number] | undefined): void {
    this.diceStore.setDices(dices);
  }
}
