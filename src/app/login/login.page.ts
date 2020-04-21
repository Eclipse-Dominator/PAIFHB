import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

import * as firebase from "firebase";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  user;
  token;

  doGoogleLogin() {
    let provider = new firebase.auth.GoogleAuthProvider();
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
          console.log(this.user);
        },
        (error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
          console.log(errorMessage);
        }
      );
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
  }

  testFireCloud() {
    var db = firebase.firestore();
    db.collection("users")
      .doc(this.user.uid)
      .set(
        {
          username: this.user.displayName,
          uploads: ["oMYM7XetIgff39WcUAHi"],
        },
        { merge: true }
      )
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

  ngOnInit() {}
}
