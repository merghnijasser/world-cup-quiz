import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode
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



// ======================
// Translate
// ======================

import {
  TranslateLoader
} from '@ngx-translate/core';



import {
  TranslateHttpLoader
} from '@ngx-translate/http-loader';





// ======================
// Firebase
// ======================

import {
  provideFirebaseApp,
  initializeApp
} from '@angular/fire/app';



import {
  provideAuth,
  getAuth
} from '@angular/fire/auth';



import {
  provideFirestore,
  getFirestore
} from '@angular/fire/firestore';



import {
  environment
} from '../environments/environment';



import { provideRouter, Route } from '@angular/router';
import { routes } from './app.routes';


// Loader traduction JSON

export function HttpLoaderFactory(){

  return new TranslateHttpLoader();

}







export const appConfig: ApplicationConfig = {



providers: [



  // Angular Error Handler

  provideBrowserGlobalErrorListeners(),





  // Optimisation Angular

  provideZoneChangeDetection({

    eventCoalescing:true

  }),





  // SSR Hydration

  provideClientHydration(

    withEventReplay()

  ),





  // HTTP

  provideHttpClient(

    withFetch()

  ),





  // Animations

  provideAnimations(),





  // =====================
  // Translation
  // =====================


  {

    provide: TranslateLoader,

    useFactory: HttpLoaderFactory,

    deps:[HttpClient]

  },







  // =====================
  // Firebase App
  // =====================


  provideFirebaseApp(

    () => initializeApp(

      environment.firebaseConfig

    )

  ),







  // =====================
  // Firebase Auth
  // Login Google / Email
  // =====================


  provideAuth(

    () => getAuth()

  ),







  // =====================
  // Firebase Firestore
  // Profil utilisateur
  // XP
  // Score
  // =====================


  provideFirestore(

    () => getFirestore()

  ),







  // =====================
  // PWA
  // =====================


  provideServiceWorker(

    'ngsw-worker.js',

    {

      enabled: !isDevMode(),

      registrationStrategy:

        'registerWhenStable:30000'

    }

  ),
  provideRouter(routes)


]

};