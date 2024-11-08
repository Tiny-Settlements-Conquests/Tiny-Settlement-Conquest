import { Injectable } from "@angular/core";
import { createStore, select, withProps } from "@ngneat/elf";
import { DEFAULT_WINNING_POINTS, LobbySettings, LobbyUser, MAX_PLAYER_COUNT } from "../models/lobby.model";
import { MapInformation } from "../../../map-selection/domain/models/map-selection.model";

const lobbySettingsStore = createStore(
    { name: 'lobbySettings' },
    withProps<LobbySettings>({
        maxPlayers: MAX_PLAYER_COUNT,
        users: [],
        winningPoints: DEFAULT_WINNING_POINTS,
        mapData: null
    })
);

@Injectable({
    providedIn: 'root'
})
export class LobbyRepository {
    public updateSettings(settings: LobbySettings) {
        lobbySettingsStore.update((state) => ({...state,...settings }));
    }

    public setUsers(users: LobbyUser[]): void {
        lobbySettingsStore.update((state) => ({...state, users}));
    }

    public selectWinningPoints() {
        return lobbySettingsStore.pipe(select((state) => state.winningPoints));
    }

    public selectMaxPlayers() {
        return lobbySettingsStore.pipe(select((state) => state.maxPlayers));
    }

    public addPlayer(user: LobbyUser) {
        lobbySettingsStore.update((state) => ({...state, users: [...state.users, user]}));
    }

    public removePlayer(id: string) {
        lobbySettingsStore.update((state) => ({...state, users: state.users.filter((u) => u.id!== id)}));
    }

    public selectUsers() {
        return lobbySettingsStore.pipe(select((state) => state.users));
    }

    public getUsers() {
        return lobbySettingsStore.query(state => state.users);
    }

    public selectIsMaxPlayers() {
        return lobbySettingsStore.pipe(
            select((state) => state.users.length >= state.maxPlayers)
        );
    }

    public setMapData(data: MapInformation) {
        lobbySettingsStore.update((state) => ({...state, mapData: data}));
    }
    
    public selectMapData() {
        return lobbySettingsStore.pipe(select((state) => state.mapData));
    }

    public getMapData() {
        return lobbySettingsStore.query(state => state.mapData);
    }

}