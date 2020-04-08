import { Injectable } from '@angular/core';
//import { HTTP } from '@ionic-native/http/ngx/'; // mobile
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CompilerApiService {

  apiUrl:string = "http://api.paiza.io:80";
  headers = {
    'Content-Type': 'application/json'
  };
  post_session:string = "/runners/create";
  get_status:string = "/runners/get_status";
  get_details:string = "/runners/get_details";

  constructor(
    //private http:HTTP,
    private http:HttpClient
  ) { }

  compile_code(content:string,user_input:string,compiler:string){
    let body = {
      "language": compiler,
      "source_code": content,
      "input": user_input,
      "api_key": "guest"
    };
    
    console.log(body); 
    
    
    return new Promise((resolve,reject) => {
      /*
      this.http.post(this.apiUrl+this.post_session,body,this.headers)
      .then((data) => {
        console.log(data);
        resolve(JSON.parse( data.data ));
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
      */

      // non native implmentation
      this.http.post<IncompleteResponse>(this.apiUrl+this.post_session,body).subscribe(
        data => {
          console.log(data);
          resolve(data);
        },
        err => reject(err)
      );
     


    });
  }

  check_completion(id:string){
    let body = {
      "id": id,
      "api_key": "guest"
    };
    let addon:string = "?id="+id+"&api_key=guest";
    return new Promise((resolve,reject) => {

      // native implementation
      /*
      this.http.get(this.apiUrl+this.get_status,body,this.headers)
      .then((data) => {
        //console.log(JSON.parse( data.data ));
        resolve(JSON.parse( data.data ));
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
      */

      //non-native implentation
      this.http.get<IncompleteResponse>(this.apiUrl+this.get_status+addon).subscribe(
        data => {
          console.log(data);
          resolve(data);
        },
        err => {
          console.log(err);
          reject(err)
        }
      );
    });
  }

  async get_result(id:string){
    console.log("getting result");
    let addon:string = "?id="+id+"&api_key=guest";
    let body = {
      "id": id,
      "api_key": "guest"
    };
    try {
      //native
      //let result = await this.http.get(this.apiUrl+this.get_details,body,this.headers)
      //return JSON.parse( result.data );
      
      //non-native
      return await this.http.get<Response>(this.apiUrl+this.get_details+addon).toPromise()

      
    } catch (error) {
      return Promise.reject(new Error("An error occured when fetching the result"))
    }
    
  }

  timeout = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

  async continued_query(id:string,tries:number){
    let result:any;
    while (tries-- > 0){
      console.log(tries);
      result = await this.check_completion(id)
      if (result.status == "completed") {
        return await this.get_result(id);
      }
      await this.timeout(1000);
    }
    return Promise.reject(new Error("Unable to connect to server!"));
  }
}

// Generated by https://quicktype.io

export interface Response {
  id:              string;
  language:        string;
  note:            null;
  status:          string;
  build_stdout:    null;
  build_stderr:    null;
  build_exit_code: number;
  build_time:      null;
  build_memory:    number;
  build_result:    null;
  stdout:          string;
  stderr:          string;
  exit_code:       number;
  time:            string;
  memory:          number;
  connections:     number;
  result:          string;
}

export interface FilteredResponse {
  language:        string;
  stdout:          string;
  stderr:          string;
  time:            string;
  result:          boolean;
}

export interface IncompleteResponse {
  id:              string;
  status:          string;
  error:           string;
}