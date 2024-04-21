import { Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { FeedComponent } from './feed/feed.component';

export const routes: Routes = [
    { path: 'login', component: LoginFormComponent},
    { path: 'feed', component: FeedComponent},
];