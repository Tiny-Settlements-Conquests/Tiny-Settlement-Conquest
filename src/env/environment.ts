export enum Edition {
    SINGLEPLAYER,
    MULTIPLAYER
}


export interface ENVIRONMENT {
    prod: boolean;
    edition: Edition;
    version: string;
}

export const ENVIRONMENT: ENVIRONMENT = {
    prod: true,
    edition: Edition.SINGLEPLAYER,
    version: '0.1.0',
}