import { Resources } from "../../../resources/domain/models/resources.model";
import { filterEmptyResources } from "./trade.utils";

export function checkIsAValidBankTrade(offeredResources: Partial<Resources>, requestedResources: Partial<Resources>) {
    let fourCardsCount = 0;
    const filteredOfferedResources = filterEmptyResources(offeredResources)
    const division = Object.values(filteredOfferedResources).reduce((acc, resourceCount) => { 
      if(resourceCount % 4 === 0) {
        fourCardsCount += resourceCount / 4;
        return true && acc
      }
      return false;
    }, true);
    return division && fourCardsCount === Object.keys(filteredOfferedResources).length
}