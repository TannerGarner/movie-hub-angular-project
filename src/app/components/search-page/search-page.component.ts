import { Component } from '@angular/core';
import { debounceTime, map, Observable, startWith, switchMap } from 'rxjs';
import { TmdbService } from '../../services/tmdb.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-page',
  standalone: false,
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  public searchControl = new FormControl('');
  public searchResults$: Observable<any>;

  constructor(private tmdbService: TmdbService) {
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((searchQuery: string | null) => this.tmdbService.searchMoviesByTitle(searchQuery)),
      map((searchRes: any) => searchRes.results)
    );
  }
}
