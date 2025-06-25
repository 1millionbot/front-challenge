import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import 'bootstrap/dist/css/bootstrap.min.css';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
