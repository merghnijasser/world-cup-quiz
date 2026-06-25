import { Injectable, signal } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  user,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
  , updateProfile
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = signal<User | null>(null);
  private googleProvider = new GoogleAuthProvider();

  constructor(private auth: Auth) {
    // ✅ Écouter les changements d'authentification
    user(this.auth).subscribe(user => {
      this.user.set(user);
      console.log('Auth state changed:', user?.email || 'Not logged in');
    });
  }

  // ✅ Connexion email/password
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // ✅ Inscription email/password
  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  // ✅ Déconnexion
  logout(): Observable<any> {
    return from(signOut(this.auth));
  }

  // ✅ Connexion avec Google
  loginGoogle(): Promise<any> {
    return signInWithPopup(this.auth, this.googleProvider);
  }

  // ✅ Mot de passe oublié
  resetPassword(email: string): Observable<any> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  // ✅ Vérifier si authentifié
  isAuthenticated(): boolean {
    return this.user() !== null;
  }

  // ✅ Récupérer l'utilisateur courant
  getCurrentUser(): User | null {
    return this.user();
  }

  // ✅ Récupérer l'ID de l'utilisateur
  getUserId(): string | null {
    return this.user()?.uid || null;
  }

  // ✅ Récupérer l'email de l'utilisateur
  getUserEmail(): string | null {
    return this.user()?.email || null;
  }

  // ✅ Récupérer le nom d'affichage
  getDisplayName(): string | null {
    return this.user()?.displayName || this.user()?.email?.split('@')[0] || 'Joueur';
  }

  // ✅ Mettre à jour le profil
  async updateProfile(displayName: string, photoURL?: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, {
        displayName,
        photoURL: photoURL || currentUser.photoURL || undefined
      });
      // ✅ Forcer la mise à jour du signal
      this.user.set(this.auth.currentUser);
    }
  }

  // ✅ Supprimer le compte
  async deleteAccount(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      await currentUser.delete();
    }
  }
}