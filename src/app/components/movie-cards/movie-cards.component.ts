import { Component, Input } from '@angular/core';
import { Movie } from '../../interfaces/movie';

@Component({
  selector: 'app-movie-cards',
  standalone: false,
  templateUrl: './movie-cards.component.html',
  styleUrl: './movie-cards.component.scss'
})
export class MovieCardsComponent {
  @Input() movies: Movie[] = [];
  @Input() noMoviesMsg: string = "No movies found.";
}
