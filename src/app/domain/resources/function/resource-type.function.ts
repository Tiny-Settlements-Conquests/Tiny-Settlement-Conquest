import { ResourceType, ResourceCard } from "../domain/models/resource-field.model";

export function resourceTypeToResourceCard(resourceType: ResourceType): ResourceCard {
    if(resourceType === 'wood') {
        return {
            typ: 'wood',
            imageUrl: '/assets/images/wood.png'
        }
    }
    if(resourceType ==='stone') {
        return {
            typ:'stone',
            imageUrl:'/assets/images/stone.png'
        }
    }
    if(resourceType === 'wool') {
        return {
            typ: 'wool',
            imageUrl: '/assets/images/sheep.png'
        }
    }
    if(resourceType ==='straw') {
        return {
            typ:'straw',
            imageUrl:'/assets/images/wheat.png'
        }
    }
    return {
        typ: 'bricks',
        imageUrl: '/assets/images/brick.png'
    }
}
