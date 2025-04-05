import { create } from 'zustand'
import { db, auth } from '@/lib/firebase'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  DocumentData 
} from 'firebase/firestore'
import { Bookmark, Category } from '@/lib/types'

// Extended Bookmark with category
interface BookmarkWithCategory extends Bookmark {
  category?: string;
}

interface BookmarkStore {
  // State
  bookmarks: BookmarkWithCategory[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBookmarks: () => Promise<void>;
  addBookmark: (bookmark: Omit<BookmarkWithCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateBookmark: (id: string, data: Partial<BookmarkWithCategory>) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  
  // Filter bookmarks by category
  getBookmarksByCategory: (categoryId: string) => BookmarkWithCategory[];
  
  // Get bookmarks by team ID
  getBookmarksByTeam: (teamId: string) => BookmarkWithCategory[];
  
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<string>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  // Initial state
  bookmarks: [],
  categories: [],
  loading: false,
  error: null,

  // Bookmark actions
  fetchBookmarks: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      set({ loading: true, error: null });
      
      const q = query(collection(db, "bookmarks"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const bookmarks: BookmarkWithCategory[] = [];
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        bookmarks.push({
          id: doc.id,
          title: data.title,
          url: data.url,
          description: data.description,
          tags: data.tags || [],
          aiSummary: data.aiSummary,
          favicon: data.favicon,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          userId: data.userId,
          teamId: data.teamId,
          isPublic: data.isPublic || false,
          category: data.category || 'personal', // Default to personal if no category
        });
      }
      
      set({ bookmarks, loading: false });
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      set({ error: "Failed to fetch bookmarks", loading: false });
    }
  },

  // Filter bookmarks by category
  getBookmarksByCategory: (categoryId: string) => {
    const { bookmarks } = get();
    return bookmarks.filter(bookmark => bookmark.category === categoryId);
  },

  // Get bookmarks by team ID
  getBookmarksByTeam: (teamId: string) => {
    const { bookmarks } = get();
    return bookmarks.filter(bookmark => bookmark.teamId === teamId);
  },

  addBookmark: async (bookmarkData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    try {
      set({ loading: true, error: null });
      
      const bookmarkWithUser = {
        ...bookmarkData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "bookmarks"), bookmarkWithUser);
      
      const newBookmark: BookmarkWithCategory = {
        id: docRef.id,
        ...bookmarkData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      set((state) => ({ 
        bookmarks: [...state.bookmarks, newBookmark],
        loading: false 
      }));
      
      return docRef.id;
    } catch (error) {
      console.error("Error adding bookmark:", error);
      set({ error: "Failed to add bookmark", loading: false });
      throw error;
    }
  },

  updateBookmark: async (id, data) => {
    try {
      set({ loading: true, error: null });
      
      const bookmarkRef = doc(db, "bookmarks", id);
      await updateDoc(bookmarkRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      
      set((state) => ({
        bookmarks: state.bookmarks.map((bookmark) => 
          bookmark.id === id 
            ? { ...bookmark, ...data, updatedAt: new Date() } 
            : bookmark
        ),
        loading: false
      }));
    } catch (error) {
      console.error("Error updating bookmark:", error);
      set({ error: "Failed to update bookmark", loading: false });
      throw error;
    }
  },

  deleteBookmark: async (id) => {
    try {
      set({ loading: true, error: null });
      
      await deleteDoc(doc(db, "bookmarks", id));
      
      set((state) => ({
        bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      set({ error: "Failed to delete bookmark", loading: false });
      throw error;
    }
  },

  // Category actions
  fetchCategories: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      set({ loading: true, error: null });
      
      const q = query(collection(db, "categories"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const categories: Category[] = [];
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        categories.push({
          id: doc.id,
          name: data.name,
          userId: data.userId,
          teamId: data.teamId,
          bookmarkIds: data.bookmarkIds || [],
        });
      }
      
      set({ categories, loading: false });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ error: "Failed to fetch categories", loading: false });
    }
  },

  addCategory: async (categoryData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    try {
      set({ loading: true, error: null });
      
      const categoryWithUser = {
        ...categoryData,
        userId,
      };
      
      const docRef = await addDoc(collection(db, "categories"), categoryWithUser);
      
      const newCategory: Category = {
        id: docRef.id,
        ...categoryData,
        userId,
      };
      
      set((state) => ({ 
        categories: [...state.categories, newCategory],
        loading: false 
      }));
      
      return docRef.id;
    } catch (error) {
      console.error("Error adding category:", error);
      set({ error: "Failed to add category", loading: false });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    try {
      set({ loading: true, error: null });
      
      const categoryRef = doc(db, "categories", id);
      await updateDoc(categoryRef, data);
      
      set((state) => ({
        categories: state.categories.map((category) => 
          category.id === id 
            ? { ...category, ...data } 
            : category
        ),
        loading: false
      }));
    } catch (error) {
      console.error("Error updating category:", error);
      set({ error: "Failed to update category", loading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ loading: true, error: null });
      
      await deleteDoc(doc(db, "categories", id));
      
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error("Error deleting category:", error);
      set({ error: "Failed to delete category", loading: false });
      throw error;
    }
  },
}));

export default useBookmarkStore; 