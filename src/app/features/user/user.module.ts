import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBQtXm_Ku_CcqGIUFzGHh7UYL1ecUzSr5A',
      libraries: ['places']
    }),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ProfileComponent]
})
export class UserModule { }
