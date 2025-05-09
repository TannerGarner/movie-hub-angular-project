import { Component, Input } from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-cards',
  standalone: false,
  templateUrl: './movie-cards.component.html',
  styleUrl: './movie-cards.component.scss'
})
export class MovieCardsComponent {
  @Input() movies: Movie[] = [];
  @Input() noMoviesMsg: string = "No movies found.";

  constructor(private router: Router) { }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
    window.scrollTo(0, 0);    
  }
}
