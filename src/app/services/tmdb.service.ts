import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tmdbSecrets } from "../../environments/tmdb.environment";

@Injectable({
  providedIn: "root"
})
export class TmdbService {
  private baseApiUrl: string = "https://api.themoviedb.org/3";

  constructor(private http: HttpClient) { }

  searchMovies(query: string): Observable<any> {
    const params = new HttpParams().set("query", query);
    const headers = new HttpHeaders().set("Authorization", `Bearer ${tmdbSecrets.accessToken}`);

    return this.http.get(`${this.baseApiUrl}/search/movie`, { params, headers });
  }
}
