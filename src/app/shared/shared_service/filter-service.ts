import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterParams = new BehaviorSubject<any>({});
  currentFilterParams = this.filterParams.asObservable();

  setFilterParams(params: any) {
    this.filterParams.next(params);
  }
}