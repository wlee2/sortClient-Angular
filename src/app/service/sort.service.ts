import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor(
    private http: HttpClient
  ) { }

  postUnsortedDataIntType(unsortedData, selectedSortType) {
    const url = `http://localhost:56072/api/${selectedSortType}/int`
    return this.http.post(url, unsortedData);
  }

  postUnsortedDataDoubleType(unsortedData, selectedSortType) {
    const url = `http://localhost:56072/api/${selectedSortType}/double`
    return this.http.post(url, unsortedData);
  }

  postUnsortedDataStringType(unsortedData, selectedSortType) {
    const url = `http://localhost:56072/api/${selectedSortType}/string`
    return this.http.post(url, unsortedData);
  }
}
