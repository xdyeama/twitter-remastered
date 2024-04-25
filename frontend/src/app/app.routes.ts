import { Routes } from '@angular/router';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { UserPageComponent } from './user-page/user-page.component';
import { TweetDetailComponent } from './tweet-detail/tweet-detail.component';
import { FollowersListComponent } from './followers-list/followers-list.component';
import { FeedComponent } from './feed/feed.component';


export const routes: Routes = [
    { path: '', redirectTo: 'feed', pathMatch: 'full'},
    { path: 'login', component: ReactiveFormComponent, title: 'Login page'},
    { path: 'feed', component: FeedComponent, title: 'Feed'},
    { path: ':username', component: UserPageComponent, title: 'User page'},
    { path: ':username/followers', component: FollowersListComponent, title: 'User followers'},
    { path: 'tweets/:id', component: TweetDetailComponent, title: 'Tweet'},
    // { path: '**', component: PageNotFoundComponent }
];
