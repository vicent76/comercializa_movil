import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  (window as any).deepLinkUrl = null;
(window as any).handleOpenURL = (url: string) => {
  console.log('handleOpenURL called with URL:', url);
  (window as any).deepLinkUrl = url;
};

