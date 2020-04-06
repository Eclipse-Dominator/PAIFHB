import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx/';
import { resolve } from 'url';

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
  constructor(private http:HTTP) { }

  compile_code(content:string,user_input:string,compiler:string){
    let body = {
      "language": compiler,
      "source_code": content,
      "input": user_input,
      "api_key": "guest"
    };
    
    console.log(body); 
    
    
    return new Promise((resolve,reject) => {

      this.http.post(this.apiUrl+this.post_session,body,this.headers)
      .then((data) => {
        console.log(data);
        resolve(JSON.parse( data.data ));
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })

    });
  }

  check_completion(id:string){
    let body = {
      "id": id,
      "api_key": "guest"
    };
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl+this.get_status,body,this.headers)
      .then((data) => {
        //console.log(JSON.parse( data.data ));
        resolve(JSON.parse( data.data ));
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
    });
  }

  async get_result(id:string){
    console.log("getting result");
    let body = {
      "id": id,
      "api_key": "guest"
    };
    try {
      let result = await this.http.get(this.apiUrl+this.get_details,body,this.headers)
      return JSON.parse( result.data );
    } catch (error) {
      return Promise.reject(new Error("An error occured when fetching the result"))
    }
    
  }

  timeout = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

  async continued_query(id:string,tries:number){
    let result:any;
    while (--tries > 0){
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
