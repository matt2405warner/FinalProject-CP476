import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  signIn(newUser: Object): Observable<Object> {
    let header = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: header});
    return this.http.post('/api/signin', JSON.stringify(newUser), options)
            .map((res: Response) => {
                let body = res.json();
                return body || {};
            })
            .catch((error: Response | any) => {
                let errMsg: string;
                if (error instanceof Response) {
                    const body = error.json() || '';
                    const err = body.error || JSON.stringify(body);
                    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
                } else {
                    errMsg = error.message ? error.message : error.toString();
                }
                console.log(errMsg);
                return Observable.throw(errMsg);
            });
  }

  signUp(newUser: Object): Observable<Object> {
    let header = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: header});
    return this.http.post('/api/signup', JSON.stringify(newUser), options)
            .map((res: Response) => {
                let body = res.json();
                return body || {};
            })
            .catch((error: Response | any) => {
                let errMsg: string;
                if (error instanceof Response) {
                    const body = error.json() || '';
                    const err = body.error || JSON.stringify(body);
                    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
                } else {
                    errMsg = error.message ? error.message : error.toString();
                }
                console.log(errMsg);
                return Observable.throw(errMsg);
            });
  }
};