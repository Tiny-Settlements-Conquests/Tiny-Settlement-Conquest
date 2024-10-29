import { ActionCardMode } from "../../../cards/feature/action-card/action-card.component";
import { ResourceCard } from "../models/resource-card.model";
import { ResourceType, Resources } from "../models/resources.model";

export function resourceTypeToResourceCard(resourceType: ResourceType): ResourceCard {
    if(resourceType === 'wood') {
        return {
            typ: 'wood',
            imageUrl: '/assets/resources/wood.png'
        }
    }
    if(resourceType ==='stone') {
        return {
            typ:'stone',
            imageUrl:'/assets/resources/stone.png'
        }
    }
    if(resourceType === 'wool') {
        return {
            typ: 'wool',
            imageUrl: '/assets/resources/sheep.png'
        }
    }
    if(resourceType ==='straw') {
        return {
            typ:'straw',
            imageUrl:'/assets/resources/wheat.png'
        }
    }
    return {
        typ: 'bricks',
        imageUrl: '/assets/resources/brick.png'
    }
}

export function resourcesToResourceCards(resources: Partial<Resources>): ResourceCard[] {
    return Object.keys(resources)
        .filter((key) => resources[key as keyof Resources] ?? 0 > 0)
        .map((key) => resourceTypeToResourceCard(key as ResourceType))
}

export function resourceTypeToActionCardMode(resourceType: ResourceType): ActionCardMode {
    if(resourceType === 'wood') {
        return 'darkGreen'
    }
    if(resourceType ==='stone') {
        return 'gray'
    }
    if(resourceType === 'wool') {
        return 'lightGreen'
    }
    if(resourceType ==='straw') {
        return 'yellow'
    }
    return 'red'
}