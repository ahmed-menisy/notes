import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(notes: any[], term: string):any {
   if(term.length >= 0) {
    return notes.filter((note) => note.title.toLowerCase().includes(term.toLowerCase()));
   }
  }
}
