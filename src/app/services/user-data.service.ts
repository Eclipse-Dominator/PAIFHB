import { Injectable } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage/ngx";

import * as firebase from "firebase";
import { UserInfo } from "firebase";

@Injectable({
  providedIn: "root",
})
export class UserDataService {
  private userData: UserInfo;
  private accessToken: string;
  private database: any;

  setSession(token: string = "") {
    this.userData = this.getUser();
    this.accessToken = token;

    // write to storage
    this.nativeStorage
      .setItem("sessionData", {
        userData: this.userData,
        accessToken: this.accessToken,
      })
      .then(
        () => console.log("Session Data Saved"),
        (error) => console.error("Error Saving Session", error)
      );

    this.nativeStorage.getItem("myitem").then(
      (data) => console.log(data),
      (error) => console.error(error)
    );

    if (!this.database) this.database = firebase.firestore();
  }

  deleteSession() {
    this.nativeStorage.remove("sessionData").then(
      (success) => {
        console.log("Session data wiped");
      },
      (error) => {
        console.log("Error wiping session data");
      }
    );
  }

  setUser(user: UserInfo) {
    this.userData = user;
  }

  getToken() {
    return this.accessToken;
  }

  getUser() {
    if (this.userData) {
      return this.userData;
    } else {
      this.userData = firebase.auth().currentUser;
      return this.userData;
    }
  }

  userUpdate(uploadID: string) {
    // update Users collection
    this.database
      .collection("users")
      .doc(this.userData.uid)
      .set(
        {
          username: this.userData.displayName,
          uploads: [uploadID],
        },
        { merge: true }
      )
      .then(
        () => {
          console.log("Success");
        },
        (error) => {
          console.error("Error adding document: ", error);
        }
      );
  }

  constructor(private nativeStorage: NativeStorage) {}
}
