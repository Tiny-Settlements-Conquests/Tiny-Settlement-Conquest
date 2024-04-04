export function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

export function rollDices(): [number, number] {
    return [rollDice(), rollDice()];
}