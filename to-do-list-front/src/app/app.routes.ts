import { Routes } from '@angular/router';
import {ToDoList} from './components/to-do-list/to-do-list';
import {Login} from './components/login/login';
import {AuthGuard} from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'todo-list-adsum',
    component: ToDoList,
    //canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: '**',
    redirectTo: 'todo-list-adsum'
}
];
