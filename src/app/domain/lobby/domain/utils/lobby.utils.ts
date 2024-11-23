import { LobbyUser } from "../models/lobby.model";

export function generateRandomLobbyRobot(): LobbyUser {
    const profileUrls = [
         'assets/avatars/robot_3.png',
         'assets/avatars/robot.png',
         'assets/avatars/robot_2.png'
    ];
    const randomNames = [
        'Andy', 'Mika', 'Robin', 'Bob', 'Tim', 'Andrew'
    ];

    return {
        id: Math.floor(Math.random() * 523523 % 10000).toString(),
        isRobot: true,
        name: randomNames[Math.floor(Math.random() * randomNames.length)],
        profileUrl: profileUrls[Math.floor(Math.random() * profileUrls.length)],
    };
}