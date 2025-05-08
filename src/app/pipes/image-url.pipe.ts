import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
  standalone: false
})
export class ImageUrlPipe implements PipeTransform {
  transform(imagePath: string | null): string {
    // TODO: Add default image or comparable no image handling.
    return `https://image.tmdb.org/t/p/original${imagePath}`;
  }
}
