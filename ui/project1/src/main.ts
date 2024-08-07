import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

async function bootstrapApp() {
  try {
    await bootstrapApplication(AppComponent, appConfig);
  } catch (error) {
    console.error(error);
  }
}

void bootstrapApp();
