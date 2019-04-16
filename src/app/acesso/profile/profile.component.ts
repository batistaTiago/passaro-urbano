import { Component, OnInit } from '@angular/core';
import { Authenticator } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authenticator: Authenticator) { }

  private userIsVendor: boolean

  public getUserIsVendor(): boolean {
    if (this.userIsVendor === null || this.userIsVendor === null) {
      this.updateIsVendorStatus()
    }
    return this.userIsVendor
  }

  ngOnInit() {
    this.updateIsVendorStatus()
  }

  private updateIsVendorStatus() {
    this.userIsVendor = this.authenticator.getUserInfo()[1].isVendor
  }

  public test() {
    console.log(this.authenticator.getUserInfo())
  }


}
