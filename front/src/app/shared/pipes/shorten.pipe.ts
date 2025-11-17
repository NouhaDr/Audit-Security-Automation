import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
  standalone: true
})
export class ShortenPipe implements PipeTransform {

  transform(value: string, size : number): string {
    return (value.length > size ? value.substring(0, size) : value) + '...';
  }

}
