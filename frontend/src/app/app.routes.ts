import { Routes } from '@angular/router';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { UserPageComponent } from './user-page/user-page.component';
import { TweetDetailComponent } from './tweet-detail/tweet-detail.component';

export const routes: Routes = [
    { path: '', component: ReactiveFormComponent },
    { path: ':username', component: UserPageComponent, title: 'User page' },
    { path: 'tweets/:id', component: TweetDetailComponent, title: 'Tweet' },
];
