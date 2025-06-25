import { Routes } from '@angular/router';
import { ComparacionCurricularComponent } from './components/comparacion-curricular/comparacion-curricular.component';
import { ComparisonDifferenceComponent } from './components/comparison-difference/comparison-difference.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ValidarComponent } from './components/validar/validar.component';
import { CommentComponent } from './components/comment/comment.component';
import { authGuard } from './guard/auth.guard';


export const routes: Routes = [
  {
    path: 'comparador-curricular',
    title: 'Comparador Curricular',
    component: ComparacionCurricularComponent,
    canActivate: [authGuard],
  },
  {
    path: 'comparison-difference',
    title: 'Comparison Difference',
    component: ComparisonDifferenceComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    title: 'Login',
    component: LoginComponent
  },
  {
    path: 'validar',
    title: 'Validar',
    component: ValidarComponent,
    canActivate: [authGuard],
  },
  {
    path: "comment",
    title: "Comment",
    component: CommentComponent,
    canActivate: [authGuard],
  },
  {path: '**', redirectTo: ''}
];
