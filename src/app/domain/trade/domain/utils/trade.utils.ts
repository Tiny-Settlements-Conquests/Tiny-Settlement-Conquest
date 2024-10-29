import { Resources } from "../../../resources/domain/models/resources.model";

export function isAValidTrade(offerInventoryResources : Partial<Resources>, requestInventoryResources : Partial<Resources>) {
    const filteredOfferedResources = filterEmptyResources(offerInventoryResources)
    
    return !Object.keys(filteredOfferedResources)
        .find((key) => requestInventoryResources?.[key as keyof Resources])
}

export function filterEmptyResources(resources : Partial<Resources>): Partial<Resources> {
    return Object.keys(resources)
        .filter((key) => resources[key as keyof Resources] ?? 0 > 0)
        .reduce((result, key) => ({...result, [key]: resources[key as keyof Resources]}), {} as Resources);
}