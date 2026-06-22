import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom
} from '@angular/core';


import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';


import {
  provideServiceWorker
} from '@angular/service-worker';


import {
  provideHttpClient,
  withFetch,
  HttpClient
} from '@angular/common/http';


import {
  provideAnimations
} from '@angular/platform-browser/animations';


// ngx translate
import {
  TranslateLoader,
  
} from '@ngx-translate/core';


import {
  TranslateHttpLoader
} from '@ngx-translate/http-loader';




// Loader pour fichiers JSON
export function HttpLoaderFactory() {
  return new TranslateHttpLoader();
}



export const appConfig: ApplicationConfig = {


  providers: [


    provideBrowserGlobalErrorListeners(),



    provideZoneChangeDetection({

      eventCoalescing: true

    }),



    provideClientHydration(

      withEventReplay()

    ),



    provideHttpClient(

      withFetch()

    ),



    provideAnimations(),



    // 🌍 Traduction
    {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },




    provideServiceWorker(

      'ngsw-worker.js',

      {

        enabled: !isDevMode(),

        registrationStrategy:
          'registerWhenStable:30000'

      }

    )

  ]

};