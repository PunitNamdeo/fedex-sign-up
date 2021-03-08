import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostUserDataService {
  url: string;

  constructor(private httpClient: HttpClient) {
    this.url = 'https://demo-api.now.sh';
  }

  postFormData(postData: object): any {
    const endPoints = '/users';
    this.httpClient.post(this.url + endPoints, postData).subscribe(data => {
      console.log(data);
    });
  }
}
