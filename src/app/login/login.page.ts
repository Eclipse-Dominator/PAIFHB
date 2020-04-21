import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { UserDataService } from "../services/user-data.service";

import * as firebase from "firebase";
import { UserInfo } from "firebase";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private uDataSvce: UserDataService
  ) {}

  user: UserInfo;
  token: string;

  doGoogleLogin() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(
            (result: any) => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              this.token = result.credential.accessToken;
              // The signed-in user info.
              this.user = result.user;
              // ...
              // console.log(this.user);
              this.uDataSvce.setUser(this.user);
              this.uDataSvce.setSession(this.token);
            },
            (error) => {
              // Handle Errors here.
              let errorCode = error.code;
              let errorMessage = error.message;
              // The email of the user's account used.
              let email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              let credential = error.credential;
              // ...
              console.log(errorMessage);
            }
          );
      });
  }

  signOut() {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
        console.log("User signed out");
      })
      .catch(function (error) {
        // An error happened.
        console.log("User failed to sign out");
      });
    this.uDataSvce.deleteSession();
  }

  testFireCloud() {
    this.uDataSvce.userUpdate("oMYM7XetIgff39WcUAHi");
  }

  ngOnInit() {}
}
