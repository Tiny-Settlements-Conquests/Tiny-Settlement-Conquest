import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdatelogLoaderService {
  private readonly _httpClient = inject(HttpClient);

  loadMarkdown(url: string): Observable<string> {
    return this._httpClient.get(url, { responseType: 'text' });
  }

  

}
