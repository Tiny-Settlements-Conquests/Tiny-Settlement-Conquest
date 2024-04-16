import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTime',
  standalone: true,
})
export class TimePipe implements PipeTransform {

  transform(ms: number | undefined, ...args: unknown[]): unknown {
    if(typeof ms === 'undefined') return 0;
    const seconds = Math.floor(ms / 1000);

    const remainderSeconds = seconds % 60;
    const minutes = Math.floor(seconds / 60) % 60;
    const hours = Math.floor(seconds / 3600);
    
    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = minutes > 0 ? `${minutes}:` : '0:';
    const formattedSeconds = remainderSeconds < 10 ? `0${remainderSeconds}` : `${remainderSeconds}`;

    return formattedHours + formattedMinutes + formattedSeconds;
  }

}
