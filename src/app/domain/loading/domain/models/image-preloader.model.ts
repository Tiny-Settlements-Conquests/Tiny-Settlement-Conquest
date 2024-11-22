export interface PreloadImageItem {
    url: string;
    name: string;
}
  
export interface PreloadProgress {
    progress: number;
    lastLoadedItem: PreloadImageItem | null;
}

export const GAME_PRELOAD_IMAGE_MAP = [
    {
        url: 'assets/bg.jpg',
        name: 'Background',
    },
    {
        url: 'assets/resources/brick.png',
        name: 'Resource Brick',
    },
    {
        url: 'assets/resources/sheep.png',
        name: 'Resource Sheep',
    },
    {
        url: 'assets/resources/stone.png',
        name: 'Resource Stone',
    },
    {
        url: 'assets/resources/wood.png',
        name: 'Resource Wood',
    },    
    {
        url: 'assets/resources/wheat.png',
        name: 'Resource Wheat',
    },
    {
        url: 'assets/images/resource-sack.png',
        name: 'Resource Sack',
    },    
    {
        url: 'assets/terrain/sand.png',
        name: 'Terrain Sand',
    },
    {
        url: 'assets/terrain/gras.png',
        name: 'Terrain Gras',
    },
    {
        url: 'assets/buildings/bank.png',
        name: 'Building Bank',
    },
    {
        url: 'assets/buildings/city.png',
        name: 'Building City',
    },
    {
        url: 'assets/buildings/town.png',
        name: 'Building Town',
    },
    {
        url: 'assets/buildings/road.png',
        name: 'Building Road',
    },
]