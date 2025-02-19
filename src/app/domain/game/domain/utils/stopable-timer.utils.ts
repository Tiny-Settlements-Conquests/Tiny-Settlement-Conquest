import { Observable, defer, timer, map, of, EMPTY, Subject, takeUntil, tap, startWith, filter, switchMap, takeWhile } from "rxjs";

export class StoppableTimer {
  private control$: Subject<string>;
  public display$: Observable<number>;
  private timeout: number;
  private baseInterval: number = 1000;
  private currentCount: number = 0;
  private _timeoutLeft: number;
  private isRunning: boolean = false;
  private offsetMS = 1000; // count exactly to x

  constructor(timeout: number) {
    this.timeout = timeout;
    this._timeoutLeft = timeout;
    this.control$ = new Subject<string>();
    this.display$ = this.createStopwatch();
  }

  public get timeoutLeft(): number {
    return this._timeoutLeft;
  }

  private createTimeoutTicker(timeout: number, interval: number): Observable<number> {
    return timer(0, interval).pipe(
      map(x => x + 1),
      takeWhile(count => count <= timeout / interval)
    );
  }

  private createStopwatch(): Observable<number> {
    return defer(() => {
      return this.control$.pipe(
        startWith("START"),
        filter(command => ["START", "STOP", "END"].includes(command)),
        switchMap(command => {
          if (command === "START" && !this.isRunning) {
            this.isRunning = true;
            return this.createTimeoutTicker(this._timeoutLeft + this.offsetMS, this.baseInterval).pipe(
              takeUntil(this.control$),
              tap(() => this.currentCount++),
              tap(() => this._timeoutLeft = this.timeout - this.currentCount * this.baseInterval),
              filter(() => this.currentCount >= (this.timeout + this.offsetMS) / this.baseInterval),
            );
          } else if (command === "STOP" && this.isRunning) {
            this.isRunning = false;
            return EMPTY;
          } else if (command === "END") {
            return EMPTY;
          }
          return EMPTY;
        })
      );
    });
  }

  public start() {
    this.control$.next("START");
  }

  public stop() {
    this.control$.next("STOP");
  }

  public end() {
    this.control$.next("END");
    this.control$.complete();
  }
}

export function createStopableTimer(timeout: number = 4000): StoppableTimer {
  return new StoppableTimer(timeout);
}
