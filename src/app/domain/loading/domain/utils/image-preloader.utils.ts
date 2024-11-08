import { Observable, from, mergeMap, map, delay, scan, catchError, tap, concatMap } from "rxjs";
import { PreloadImageItem, PreloadProgress } from "../models/image-preloader.model";

export function preloadImageItems(items: PreloadImageItem[]): Observable<PreloadProgress> {
    const totalItems = items.length;
    let lastItem: null | PreloadImageItem = null

    return from(items).pipe(
      concatMap((item) => 
        loadImage(item).pipe(
          delay(125),
        )
      ),
      tap((item) => lastItem = item),
      scan((loadedCount) => loadedCount + 1, 0), // Zählt die geladenen Bilder
      map((progress) => ({
        progress: Math.floor((progress / totalItems) * 100),
        lastLoadedItem: lastItem
      })), // Fortschritt und zuletzt geladenes Bild berechnen
      catchError(() => [{ progress: 100, lastLoadedItem: null }]) // Setzt den Fortschritt auf 100% im Falle eines Fehlers
    );
}

function loadImage(item: PreloadImageItem): Observable<PreloadImageItem> {
    return new Observable<PreloadImageItem>((observer) => {
        const img = new Image();
        img.src = item.url;

        img.onload = () => {
        observer.next(item);
        observer.complete();
        };

        img.onerror = () => {
        observer.error('Image loading failed: ' + item.url);
        };
    });
}