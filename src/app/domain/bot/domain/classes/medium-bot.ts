import { BuildingType, PathType, PlaceableType } from "../../../buildings/domain/models/building.model";
import { Game } from "../../../game/domain/classes/game";
import { Player } from "../../../player/domain/classes/player";
import { Playground } from "../../../playground/domain/classes/playground";
import { excludeEmptyResources, getRandomResources, sumResources } from "../../../resources/domain/utils/resource.utils";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";
import { TradeRequest, TradeType } from "../../../trade/domain/models/trade.model";
import { Bot } from "../models/bot.model";

type Action = 'buildTown' | 'buildCity' | 'buildRoad' | 'trade' | 'pass';

export class MediumBot implements Bot {
  private readonly maxLoops = 3;
  private currentLoop = 0;

  public makeMove(game: Game, player: RoundPlayer): void {
    // Kopie des Spiels erstellen, um mögliche Änderungen zu simulieren

    // Würfeln und Ressourcen sammeln
    game.rollDice();
    this.currentLoop = 0;
    
    const playerObj = game.round.getPlayerById(player.id);
    if(!playerObj) throw new Error(`Player ${player.id}`)
    // Prioritäten setzen
    this.decicionTree(game, playerObj);
    
      
     
  }

  public decicionTree(game: Game, player: Player) {
    const decision = this.decideNextAction(game,  player);
    const buildingResult = this.calculateBuildingWithCurrentResources(game, player);
    // const buildingResult: PlaceableType = PathType.ROAD;

 // if(buildingResult === BuildingType.CITY) {
      //   // console.log(game);
      //   game.buildingBuildManager.buildBuilding(playerObj, BuildingType.CITY, game.playground.buildingGraph.nodes[0])
      // }

    console.log(buildingResult);
    if(buildingResult) {
      const hasEnoughtResources = this.hasEnoughtResourcesForBuilding(game, buildingResult, player);
      console.log()
      if(hasEnoughtResources) {
        this.findAPlaceToBuild(game, player, buildingResult)

      } else {
        const trade = this.getTradeOffer(game, player, buildingResult);
        // game.getTradeManager().startTrade(trade);
        console.log("TRADED")
      }
    }
    this.currentLoop++;
    if(this.currentLoop <= this.maxLoops) {
      this.decicionTree(game,player);
    }
  }

  private openAndWaitForTrade(game: Game, trade: TradeRequest) {
    const tradeManager = game.getTradeManager();
    // tradeManager.selectTradeResponse.
  }

  private findAPlaceToBuild(game: Game, player: Player, placeableType: PlaceableType) {
    const playground = game.playground;
    const buildingGraph = playground.buildingGraph;
    const graph = playground.graph;

    if(placeableType === PathType.ROAD) {
      const buildingGraphNode = buildingGraph.nodes.sort((a,b) => {
        return a.connectedPoints.length > b.connectedPoints.length ? 1 : -1;
      }).find(node => node.player.id === player.id);
      if(!buildingGraphNode) throw new Error('has no nodes');
      const graphNode = graph.getNodeById(buildingGraphNode.id);
      if(!graphNode) throw new Error('node not found: ' + buildingGraphNode.id);

      const node= graphNode.connectedPoints.find((p) => {
        const doesExist = buildingGraph.getNodeById(p.id);
        console.log("FOUND NODEH", doesExist);
        console.log("FOUND BUILDING NODEH", buildingGraphNode)
        return !doesExist ;
      });

      if(!node) throw new Error('node not found: ');
      game.roadBuildManager.buildRoadBetween(player, node, buildingGraphNode);
    }
  }

  decideNextAction(game: Game, player: Player): Action {
    const resources = player.resourceInventory;
    const totalCards = Object.values(resources).reduce((sum, value) => sum + value, 0);

    // Grundwahrscheinlichkeiten (werden dynamisch angepasst)
    let probabilityBuildCity = 0.2;
    let probabilityBuildTown = 0.3;
    let probabilityBuildRoad = 0.2;
    let probabilityTrade = 0.2;
    let probabilityPass = 0.1;
    let isEvenSpace = true;

    // Anpassung der Wahrscheinlichkeiten basierend auf der Spielsituation
    if (totalCards > 9) {
      // Priorität auf Bauen erhöhen, um das Risiko zu minimieren, Karten zu verlieren
      probabilityBuildCity += 0.1;
      probabilityBuildTown += 0.1;
    }

    // Falls der Bot genug Ressourcen für eine Stadt hat
    if (game.costManager.hasPlayerEnoughtResources(player, BuildingType.CITY)) {
      probabilityBuildCity += 0.3;
    }

    // Falls der Bot genug Ressourcen für eine Siedlung hat
    if (game.costManager.hasPlayerEnoughtResources(player, BuildingType.TOWN)) {
      probabilityBuildTown += 0.3;
    }

    // Falls der Bot keine Ressourcen für Straßen hat
    if (!game.costManager.hasPlayerEnoughtResources(player, PathType.ROAD)) {
      probabilityBuildRoad -= 0.2;
    }

    //Kann der bot überhaupt irgendwo eine Siedlung bauen?
    if(!player.buildingGraph.nodes.some((node) => game.buildingBuildManager.checkBuildingPosition(node, BuildingType.TOWN))) {
      probabilityBuildTown = 0;
      isEvenSpace = false;
    }
    //Kann der bot überhaupt irgendwo eine Stadt Upgraden?

    if(!player.buildingGraph.nodes.some((node) => game.buildingBuildManager.checkBuildingPosition(node, BuildingType.CITY))) {
      probabilityBuildCity= 0;
    }

    // Falls wichtige Ressourcen fehlen, erhöhe die Wahrscheinlichkeit des Handelns
    if (
      !game.costManager.hasPlayerEnoughtResources(player, BuildingType.TOWN) && 
      !game.costManager.hasPlayerEnoughtResources(player, BuildingType.CITY)
    ) {
      probabilityTrade += 0.2;
    }


    // Normalisiere die Wahrscheinlichkeiten, sodass ihre Summe 1 ergibt
    const totalProbability = probabilityBuildTown + probabilityBuildCity + probabilityBuildRoad + probabilityTrade + probabilityPass;
    probabilityBuildTown /= totalProbability;
    probabilityBuildCity /= totalProbability;
    probabilityBuildRoad /= totalProbability;
    probabilityTrade /= totalProbability;
    probabilityPass /= totalProbability;

    // Wähle eine Aktion basierend auf den berechneten Wahrscheinlichkeiten
    const randomValue = Math.random();

    if (randomValue < probabilityBuildTown) return 'buildTown';
    if (randomValue < probabilityBuildTown + probabilityBuildCity) return 'buildCity';
    if (randomValue < probabilityBuildTown + probabilityBuildCity + probabilityBuildRoad) return 'buildRoad';
    if (randomValue < probabilityBuildTown + probabilityBuildCity + probabilityBuildRoad + probabilityTrade) return 'trade';

    return 'pass';
  }

  private getTradeOffer(game: Game, player: Player, placeableType: PlaceableType): TradeRequest {
    const requiredResources = game.costManager.buildingCosts[placeableType];
    const requestedResources = player.resourceInventory.getResourceDifference(requiredResources);
    const requestedResourcesCount = sumResources(player.resourceInventory.getResourceDifference(requiredResources));
    const offeredResources = getRandomResources(
      excludeEmptyResources(player.resourceInventory.getResourcesExclude(requiredResources)),
      requestedResourcesCount
    )

    return {
      offeredResources,
      requestedResources,
      player: player.roundPlayer,
      typ: TradeType.Player
    }
  }

  private calculateBuildingWithCurrentResources(game: Game, player: Player): PlaceableType | null
  {
    const resources = player.resourceInventory.resources;
    const prices = game.costManager.buildingCosts;
    
    // Definiere eine Liste der möglichen Gebäude, die der Bot bauen kann.
    const possibleBuildings: Array<{ type: PlaceableType, remainingResources: number }> = [];

    // Iteriere über alle Gebäudekosten (z.B. Road, Settlement, Town).
    for (const [buildingType, cost] of Object.entries(prices)) {
        let canBuild = true;
        let remainingResources = 0;

        // Überprüfe, ob genügend Ressourcen vorhanden sind, um dieses Gebäude zu bauen.
        for (const [resource, costAmount] of Object.entries(cost)) {
            const playerAmount = resources[resource as keyof typeof cost] || 0;

            // Wenn nicht genügend Ressourcen vorhanden sind, kann das Gebäude nicht gebaut werden.
            if (playerAmount < costAmount) {
                canBuild = false;
                break;
            }
        }

        // Falls das Gebäude gebaut werden kann, berechne die verbleibenden Ressourcen.
        if (canBuild) {
            remainingResources = Object.entries(resources).reduce((remaining, [resource, playerAmount]) => {
                const costAmount = cost[resource as keyof typeof cost] || 0;
                return remaining + Math.max(0, playerAmount - costAmount);
            }, 0);

            // Füge das Gebäude mit den verbleibenden Ressourcen zur Liste hinzu.
            possibleBuildings.push({ type: buildingType as PlaceableType, remainingResources });
        }
    }

    // Sortiere die Liste nach verbleibenden Ressourcen aufsteigend (weniger Ressourcen zuerst).
    possibleBuildings.sort((a, b) => a.remainingResources - b.remainingResources);

    // Gib das Gebäude mit den geringsten verbleibenden Ressourcen zurück oder null, falls keines gebaut werden kann.
    return possibleBuildings.length > 0 ? possibleBuildings[0].type : null;
  }

  private hasEnoughtResourcesForBuilding(game: Game, placeableType: PlaceableType, player: Player): boolean {
    const resources = game.costManager.buildingCosts[placeableType];
    return player.resourceInventory.hasEnoughtResources(resources);
  }
}
