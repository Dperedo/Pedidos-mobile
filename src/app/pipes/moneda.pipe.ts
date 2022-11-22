import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda'
})
export class MonedaPipe implements PipeTransform {

  transform(value: any): any {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

}
