//import * as io from 'socket.io-client';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export class User {
    email : string;
    password : string;
    //socket: any;
    constructor(private http: Http) {
        //this.socket = io.connect('http://localhost:3232');
    }
    signIn(newUser: Object) {
        //this.socket.emit('signIn', newUser);
        console.log('clicked');
        console.log(this.http.get('/api/login')
            .map((res: Response) => {
                let body = res.json();
                return body.data || {};
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
            }));
    }


    signOut() {

    }
}
