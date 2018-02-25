import {Component, OnInit, ElementRef, ViewChild, NgZone} from '@angular/core';
import {User} from './user';
import {FormControl} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import { } from 'googlemaps';

@Component({selector: 'sv-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.scss']})
export class ProfileComponent implements OnInit {
  public user = new User();

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

  ngOnInit() {

    if (sessionStorage.getItem('user')) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.latitude = this.user.latitude;
      this.longitude = this.user.longitude;
      this.zoom = 12;
    } else {
      // set current position
      this.zoom = 4;
      this.latitude = 39.8282;
      this.longitude = -98.5795;
      this.setCurrentPosition();
    }

    // create search FormControl
    this.searchControl = new FormControl();

    // load Places Autocomplete
    this
      .mapsAPILoader
      .load()
      .then(() => {
        const autocomplete = new google
          .maps
          .places
          .Autocomplete(this.searchElementRef.nativeElement, {types: ['address']});
        autocomplete.addListener('place_changed', () => {
          this
            .ngZone
            .run(() => {
              // get the place result
              const place: google.maps.places.PlaceResult = autocomplete.getPlace();

              // verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }

              // set latitude, longitude and zoom
              this
                .searchControl
                .setValue(place.formatted_address);
              this.latitude = place
                .geometry
                .location
                .lat();
              this.longitude = place
                .geometry
                .location
                .lng();

              this.user.latitude = place
                .geometry
                .location
                .lat();
              this.user.longitude = place
                .geometry
                .location
                .lng();

              this.zoom = 12;
            });
        });
      });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator
        .geolocation
        .getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 12;
        });
    }
  }

  public onSaveClick() {
    this.user.address = this.searchControl.value;
    sessionStorage.setItem('user', JSON.stringify(this.user));
  }

}
