import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tmdbSecrets } from '../../environments/tmdb.environment';
import { TmdbVideoResponse } from '../interfaces/tmdb-video.interface';
import { TmdbSearchResponse } from '../interfaces/tmdb-search-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  public baseApiUrl: string = 'https://api.themoviedb.org/3';

  constructor(public http: HttpClient) { }

  searchMoviesByTitle(query: string | null, page: number = 1): Observable<any> {
    if (query) {
      const params = new HttpParams()
        .set('api_key', tmdbSecrets.apiKey)
        .set('query', query)
        .set('page', page.toString());
      return this.http.get<TmdbSearchResponse>(`${this.baseApiUrl}/search/movie`, { params });
    } else {
      const params = new HttpParams()
        .set('api_key', tmdbSecrets.apiKey)
        .set('page', page.toString());
      return this.http.get<TmdbSearchResponse>(`${this.baseApiUrl}/movie/popular`, { params });
    }
  }

  getMovieById(id: number) {
    const params = new HttpParams()
      .set('api_key', tmdbSecrets.apiKey);
    return this.http.get(`${this.baseApiUrl}/movie/${id}`, { params });
  }

  getMovieTrailer(id: number): Observable<TmdbVideoResponse> {
    const params = new HttpParams()
      .set('api_key', tmdbSecrets.apiKey);
    return this.http.get<TmdbVideoResponse>(`${this.baseApiUrl}/movie/${id}/videos`, { params });
  }

  getCollectionById(id: number) {
    const params = new HttpParams()
      .set('api_key', tmdbSecrets.apiKey);
    return this.http.get(`${this.baseApiUrl}/collection/${id}`, { params });
  }
}
