import { map, pipe } from "rxjs";

export function timeMapper(count: number, direction: 'up' | 'down' = 'down') {
    return pipe(
        map(() => {
            if (direction === 'up') {   
                return count += 1000;
            } 
            return count -= 1000;
        })
    )
}