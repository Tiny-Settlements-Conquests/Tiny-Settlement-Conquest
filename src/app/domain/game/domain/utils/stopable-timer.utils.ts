import { Observable, defer, timer, map, of, concat, catchError, filter, switchMap, EMPTY, Subject, takeUntil, tap, startWith, count, takeWhile } from "rxjs";

export interface StopableTimer {
    control$: Subject<string>, 
    display$: Observable<number>
}

function createTimeoutTicker(timeout: number, interval: number): Observable<number> {
    let ticker = timer(0, interval).pipe(
      map(x => x + 1),
      takeWhile(count => count <= timeout / interval)
    );
    return ticker;
  }

function createStopwatch(control$: Observable<string>, timeout: number): Observable<number>{
    return defer(() => {
      let toggle: boolean = false;
      let timeoutLeft: number = timeout;
      let baseInterval = 1000;
      let currentCount = 0;
  
      const end$ = of("END");
      console.log("CREATE STOPWATCH")
  
      return control$.pipe(
        startWith('START'),
        catchError(_ => end$),
        filter(control => 
          control === "START" ||
          control === "STOP" ||
          control === "END"
        ),
        switchMap(control => {
            console.log("<<<<<<<<<<<<<<<<<UPDATE CONTROl>>>>>>>>>>>>>>>>>", control, toggle)
          if(control === "START" && !toggle){
            toggle = true;
            return createTimeoutTicker(timeoutLeft, baseInterval).pipe(
                takeUntil(control$),
                tap(() => currentCount++),
                tap(() => timeoutLeft = timeout - currentCount * baseInterval),
                tap(() => console.log("currentcount", currentCount)),
                tap(() => console.log("timeout", timeout)),

                filter(() => currentCount >= timeout / baseInterval),
            );
          }else if(control === "STOP" && toggle){
            toggle = false;
            timeout = timeoutLeft;
            return EMPTY;
          } else if(control === "END"){
            return EMPTY;
          }
          return EMPTY;
        })
      )
    });
}

export function stopableTimer(timeout: number = 4000): StopableTimer{
    const control$ = new Subject<string>();
    const stopwatch = {
      control$,
      display$: createStopwatch(control$, timeout)
    }

    stopwatch.control$.next('START')
    return stopwatch;
  }