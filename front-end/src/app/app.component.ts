import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import * as firebase from 'firebase'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app2';

  ngOnInit() {
    var config = {
      apiKey: "AIzaSyCTYTd2evhPT0fByJ5mkFWIfoXqVC3qajs",
      authDomain: "bt-passaro-urbano.firebaseapp.com",
      databaseURL: "https://bt-passaro-urbano.firebaseio.com",
      projectId: "bt-passaro-urbano",
      storageBucket: "bt-passaro-urbano.appspot.com",
      messagingSenderId: "661068806207"
    };
    firebase.initializeApp(config);
  }
}
