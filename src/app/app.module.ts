import { APP_INITIALIZER, NgModule, NgZone  } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http"
import { FormsModule } from "@angular/forms";
import { remult } from "remult";
import { PropScreenComponent } from './prop-screen/prop-screen.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import { PropCheckoutComponent } from './prop-screen/prop-checkout/prop-checkout.component';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';
import {MatChipsModule} from '@angular/material/chips';
//import { PredictionScreenComponent } from './prediction-screen/prediction-screen.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { HomeScreenComponent } from './homescreen/homescreen.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import {MatSortModule} from '@angular/material/sort';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransformFromTimestampToMonthDayPipe } from "./customPipes/transformTimestampToMonthDay.pipe";
import { TransforFromFullTeamNameToAbvr } from './customPipes/transformFromFullTeamNameToAbvr.pip';
import { TransformFromTimestampToTimePipe } from './customPipes/transformFromTimestampToTime.pipe';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RemoveUnderScore } from "./customPipes/removeUnderScore.pipe";
import { LoginScreenComponent } from './login-screen/login-screen.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { UsersController } from 'src/shared/Controllers/UsersController';
import { PropTrendComponent } from './prop-screen/propTrend/prop-trend.component';
import { ConvertCommenceTimePipe } from './customPipes/convertCommenceTime.pipe';
import { LoginSignUpComponent } from './login-sign-up/login-sign-up.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { RemoveHeading } from './customPipes/reomveHeading.pipe';
import { GetDayAndTime } from './customPipes/getDayAndTime.pipe';
import { ConvertGameDateToMonthDay } from './customPipes/convertGameDateToMonthDay.pipe';
import { PropScreenNewComponent } from './prop-screen-new/prop-screen-new.component';
import { ParlayPopupComponent } from './prop-screen-new/parlay-popup/parlay-popup.component';
import { AuthGuard } from './app-auth-guard';


@NgModule({
    declarations: [
        AppComponent,
        PropScreenComponent,
        PropCheckoutComponent,
        HomeScreenComponent,
        PlayerStatsComponent,
        WelcomeScreenComponent,
        TeamStatsComponent,
        LoginScreenComponent,
        PropTrendComponent,
        LoginSignUpComponent,
        PropScreenNewComponent,
        ParlayPopupComponent
    ],
    providers: [
      { provide: APP_INITIALIZER, useFactory: initApp, multi: true },
      AuthGuard
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        /* RouterModule.forRoot([
         {path: 'home', component: HomeScreenComponent},
         {path: 'props:/sport:/game', component: PropScreenComponent},
         {path: '', redirectTo: 'home', pathMatch: 'full'}
       ]),  */
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTabsModule,
        MatTableModule,
        MatGridListModule,
        MatDividerModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatDialogModule,
        MatSliderModule,
        MatChipsModule,
        ScrollingModule,
        HttpClientModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        MatInputModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatSortModule,
        NgbModule,
        TransformFromTimestampToMonthDayPipe,
        TransforFromFullTeamNameToAbvr,
        TransformFromTimestampToTimePipe,
        MatMenuModule,
        MatProgressSpinnerModule,
        RemoveUnderScore,
        MatButtonToggleModule,
        ConvertCommenceTimePipe,
        RemoveHeading,
        GetDayAndTime,
        ConvertGameDateToMonthDay
        
    ]
})
export class AppModule { 
  constructor(zone: NgZone) {
    remult.apiClient.wrapMessageHandling = handler => zone.run(() => handler())
  }
}

export function initApp() {
  const loadCurrentUserBeforeAppStarts = async () => {
    remult.user = await UsersController.currentUser()
  }
  return loadCurrentUserBeforeAppStarts
}