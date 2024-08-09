export enum Edition {
    SINGLEPLAYER,
    MULTIPLAYER
}


export interface ENVIRONMENT {
    prod: boolean;
    edition: Edition;
}

export const ENVIRONMENT: ENVIRONMENT = {
    prod: false,
    edition: Edition.SINGLEPLAYER
}