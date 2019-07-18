import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './infrastructure/login/login.component';
import { RegisterComponent } from './infrastructure/register/register.component';
import { NavsideComponent } from './components/navside/navside.component';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'navside', component: NavsideComponent,
    children: [
      { path: 'home', component: HomeComponent},
      { path: 'user', component: UserComponent},
      { path: 'settings', component: SettingsComponent},
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
