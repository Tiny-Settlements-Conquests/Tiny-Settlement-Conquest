import { rollDices } from "../../../dice/domain/functions/roll-dice.function";
import { Game } from "../../../game/domain/classes/game";
import { Player } from "../../../player/domain/classes/player";
import { Bot, BotPriority } from "../models/bot.model";

export class MediumBot implements Bot {

  constructor() { }

  public makeMove(game: Game, player: Player) {
    // Get current game state

    //roll dice
    game.rollDice();



    // const board = game.playground();
    // const resources = player.getResources();
    // const cards = player.getDevelopmentCards();

    // Define bot strategy
    const costs = game.getBuildCosts();

    try {
      if(game.costManager.tryIfBuildingCanBeBuild(player, 'town')) {
        console.log("i could yes")
        this.tryToBuildTown(game, player)
      }
    } catch(e) {
    }
    try {
      if(game.costManager.tryIfBuildingCanBeBuild(player, 'road')) {
        this.tryToBuildRoad(game, player)
      }
      
    } catch(e) {}


    // Implement bot logic

    // if (strategy.priority === 'build') {
      // Check if enough resources to build
      // Use board analysis to find optimal placement  
      // Return build action
    // } else if (strategy.priority === 'trade') {
      // Check current resources
      // Find trade ratios based on tradeTarget
      // Return optimal trade action 
    // }
  }

  private tryToBuildTown(game: Game, player: Player) {
    const myOwnBuildingGraphNodes = game.playground.buildingGraph.nodes

    console.log(myOwnBuildingGraphNodes);
    game.mode = 'town';
    myOwnBuildingGraphNodes.forEach((node) => {
      game.tryBuildBuildingOnGraphNode(node)
    })
  }

  private tryToBuildRoad(game: Game, player: Player) {
    const myOwnBuildingGraphNodes = game.playground.buildingGraph.nodes
      .filter((node) => node.player.id === player.id)
      .sort((a, b) => {
        const aConnections = a.connectedPoints.length;
        const bConnections = b.connectedPoints.length;
        return aConnections - bConnections;
    });
    const myOwnGraphNodes = myOwnBuildingGraphNodes.map((node) => game.playground.graph.getNodeById(node.id));
    game.mode = 'road';

    console.log(myOwnGraphNodes);
    myOwnGraphNodes.forEach((graphNode) => {
      const connections = graphNode!.connectedPoints;
      connections.forEach((c) => {
        game.tryBuildRoadBetweenGraphNodes(graphNode!, c);
      })
    })
    console.log(game);
    console.log("TEST", myOwnBuildingGraphNodes);
    // Setzen des Spielmodus auf 'road'

  }


}
