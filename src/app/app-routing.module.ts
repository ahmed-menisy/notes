import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard, AuthGuard2 } from './guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    data:{state:'home'},
    canActivate: [AuthGuard],
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'signin',
    data:{state:'signin'},
    canActivate: [AuthGuard2],
    component: SignInComponent,
    title: 'SignIn',
  },
  {
    path: 'signup',
    data:{state:'signup'},
    canActivate: [AuthGuard2],
    component: SignUpComponent,
    title: 'SignUp',
  },
  { path: '**', component: NotFoundComponent, title: 'NotFound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
// ng build --output-path docs --base-href /notes/