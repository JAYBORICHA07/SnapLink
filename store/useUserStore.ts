import { create } from 'zustand'
import { auth, db } from '@/lib/firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

interface UserProfile {
  displayName?: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
  userId: string;
}

interface UserState {
  // State
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  user: null,
  profile: null,
  loading: false,
  error: null,
  isInitialized: false,
  
  initialize: async () => {
    set({ loading: true });
    
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Get user profile from Firestore
            const profileDoc = await getDoc(doc(db, "users", user.uid));
            
            let profile: UserProfile | null = null;
            if (profileDoc.exists()) {
              const data = profileDoc.data();
              profile = {
                displayName: data.displayName,
                email: data.email,
                photoURL: data.photoURL,
                createdAt: data.createdAt?.toDate() || new Date(),
                lastLogin: data.lastLogin?.toDate() || new Date(),
                userId: user.uid
              };
            }
            
            set({ 
              user, 
              profile,
              isInitialized: true,
              loading: false 
            });
          } catch (error) {
            console.error("Error fetching user profile:", error);
            set({ 
              user, 
              profile: null,
              error: "Failed to fetch user profile",
              isInitialized: true,
              loading: false 
            });
          }
        } else {
          set({ 
            user: null, 
            profile: null,
            isInitialized: true,
            loading: false 
          });
        }
        
        resolve();
      });
      
      // Clean up subscription
      return unsubscribe;
    });
  },
  
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login
      await updateDoc(doc(db, "users", user.uid), {
        lastLogin: new Date()
      });
      
      set({ loading: false });
    } catch (error) {
      console.error("Error signing in:", error);
      set({ 
        error: "Failed to sign in. Please check your email and password.", 
        loading: false 
      });
      throw error;
    }
  },
  
  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        displayName: email.split('@')[0],
        email,
        createdAt: new Date(),
        lastLogin: new Date(),
        userId: user.uid
      };
      
      await setDoc(doc(db, "users", user.uid), userProfile);
      
      set({ 
        profile: userProfile,
        loading: false 
      });
    } catch (error) {
      console.error("Error signing up:", error);
      set({ 
        error: "Failed to create account. This email might already be in use.", 
        loading: false 
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      set({ loading: true, error: null });
      
      await signOut(auth);
      
      set({ 
        user: null, 
        profile: null,
        loading: false 
      });
    } catch (error) {
      console.error("Error signing out:", error);
      set({ 
        error: "Failed to sign out", 
        loading: false 
      });
      throw error;
    }
  },
  
  updateProfile: async (data) => {
    const { user } = get();
    
    if (!user) throw new Error("User not authenticated");
    
    try {
      set({ loading: true, error: null });
      
      await updateDoc(doc(db, "users", user.uid), data);
      
      // Update local state
      const currentProfile = get().profile;
      const updatedProfile = currentProfile 
        ? { ...currentProfile, ...data }
        : null;
      
      set({ 
        profile: updatedProfile,
        loading: false 
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      set({ 
        error: "Failed to update profile", 
        loading: false 
      });
      throw error;
    }
  }
}));

export default useUserStore; 