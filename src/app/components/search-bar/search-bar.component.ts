import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap, tap } from 'rxjs';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  public searchControl = new FormControl('');
  public searchResults$: Observable<any>;

  constructor(private tmdbService: TmdbService) {
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((searchQuery: string | null) => this.tmdbService.searchMoviesByTitle(searchQuery))
    );
  }
}
