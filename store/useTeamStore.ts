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
  getDoc 
} from 'firebase/firestore'
import { Team, TeamMember } from '@/lib/types'

interface TeamStore {
  // State
  teams: Team[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTeams: () => Promise<void>;
  createTeam: (team: Omit<Team, 'id' | 'createdAt' | 'members'>) => Promise<string>;
  updateTeam: (id: string, data: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addMember: (teamId: string, member: Omit<TeamMember, 'id'>) => Promise<void>;
  removeMember: (teamId: string, userId: string) => Promise<void>;
  updateMemberRole: (teamId: string, userId: string, role: TeamMember['role']) => Promise<void>;
}

const useTeamStore = create<TeamStore>((set, get) => ({
  // Initial state
  teams: [],
  loading: false,
  error: null,
  
  fetchTeams: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    
    try {
      set({ loading: true, error: null });
      
      // Query teams where user is owner
      const ownerQuery = query(collection(db, "teams"), where("ownerId", "==", userId));
      const ownerSnapshot = await getDocs(ownerQuery);
      
      // Query teams where user is a member
      const memberQuery = query(collection(db, "team_members"), where("userId", "==", userId));
      const memberSnapshot = await getDocs(memberQuery);
      
      const teamIds = new Set<string>();
      const teams: Team[] = [];
      
      // Add teams where user is owner
      for (const doc of ownerSnapshot.docs) {
        const data = doc.data();
        teamIds.add(doc.id);
        teams.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          createdAt: data.createdAt?.toDate() || new Date(),
          ownerId: data.ownerId,
          members: [],
        });
      }
      
      // Add teams where user is a member
      for (const doc of memberSnapshot.docs) {
        const teamId = doc.data().teamId;
        if (!teamIds.has(teamId)) {
          teamIds.add(teamId);
          
          const teamDoc = await getDoc(doc(db, "teams", teamId));
          if (teamDoc.exists()) {
            const data = teamDoc.data();
            teams.push({
              id: teamDoc.id,
              name: data.name,
              description: data.description,
              createdAt: data.createdAt?.toDate() || new Date(),
              ownerId: data.ownerId,
              members: [],
            });
          }
        }
      }
      
      // Fetch team members for each team
      for (const team of teams) {
        const membersQuery = query(collection(db, "team_members"), where("teamId", "==", team.id));
        const membersSnapshot = await getDocs(membersQuery);
        
        const members: TeamMember[] = [];
        for (const doc of membersSnapshot.docs) {
          const data = doc.data();
          members.push({
            userId: data.userId,
            role: data.role,
            email: data.email,
            name: data.name,
          });
        }
        
        team.members = members;
      }
      
      set({ teams, loading: false });
    } catch (error) {
      console.error("Error fetching teams:", error);
      set({ error: "Failed to fetch teams", loading: false });
    }
  },
  
  createTeam: async (teamData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    
    try {
      set({ loading: true, error: null });
      
      const user = auth.currentUser;
      
      // Create team
      const teamWithOwner = {
        ...teamData,
        ownerId: userId,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "teams"), teamWithOwner);
      
      // Add owner as a member with admin role
      await addDoc(collection(db, "team_members"), {
        teamId: docRef.id,
        userId,
        role: "admin",
        email: user?.email || "",
        name: user?.displayName || user?.email?.split("@")[0] || "",
      });
      
      // Create new team object for local state
      const newTeam: Team = {
        id: docRef.id,
        name: teamData.name,
        description: teamData.description,
        createdAt: new Date(),
        ownerId: userId,
        members: [
          {
            userId,
            role: "admin",
            email: user?.email || "",
            name: user?.displayName || user?.email?.split("@")[0] || "",
          }
        ],
      };
      
      set((state) => ({ 
        teams: [...state.teams, newTeam],
        loading: false 
      }));
      
      return docRef.id;
    } catch (error) {
      console.error("Error creating team:", error);
      set({ error: "Failed to create team", loading: false });
      throw error;
    }
  },
  
  updateTeam: async (id, data) => {
    try {
      set({ loading: true, error: null });
      
      await updateDoc(doc(db, "teams", id), data);
      
      set((state) => ({
        teams: state.teams.map((team) => 
          team.id === id 
            ? { ...team, ...data } 
            : team
        ),
        loading: false
      }));
    } catch (error) {
      console.error("Error updating team:", error);
      set({ error: "Failed to update team", loading: false });
      throw error;
    }
  },
  
  deleteTeam: async (id) => {
    try {
      set({ loading: true, error: null });
      
      // Delete the team
      await deleteDoc(doc(db, "teams", id));
      
      // Delete all team members
      const membersQuery = query(collection(db, "team_members"), where("teamId", "==", id));
      const membersSnapshot = await getDocs(membersQuery);
      
      const deletePromises = membersSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      set((state) => ({
        teams: state.teams.filter((team) => team.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error("Error deleting team:", error);
      set({ error: "Failed to delete team", loading: false });
      throw error;
    }
  },
  
  addMember: async (teamId, member) => {
    try {
      set({ loading: true, error: null });
      
      // Check if member already exists
      const memberQuery = query(
        collection(db, "team_members"), 
        where("teamId", "==", teamId),
        where("userId", "==", member.userId)
      );
      const memberSnapshot = await getDocs(memberQuery);
      
      if (memberSnapshot.empty) {
        // Add new member
        await addDoc(collection(db, "team_members"), {
          teamId,
          ...member,
        });
        
        // Update local state
        set((state) => ({
          teams: state.teams.map((team) => 
            team.id === teamId 
              ? { ...team, members: [...team.members, member] } 
              : team
          ),
          loading: false
        }));
      } else {
        // Member already exists, just update their role
        const memberDoc = memberSnapshot.docs[0];
        await updateDoc(memberDoc.ref, { role: member.role });
        
        // Update local state
        set((state) => ({
          teams: state.teams.map((team) => 
            team.id === teamId 
              ? { 
                  ...team, 
                  members: team.members.map((m) => 
                    m.userId === member.userId ? { ...m, role: member.role } : m
                  ) 
                } 
              : team
          ),
          loading: false
        }));
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      set({ error: "Failed to add team member", loading: false });
      throw error;
    }
  },
  
  removeMember: async (teamId, userId) => {
    try {
      set({ loading: true, error: null });
      
      // Find member document
      const memberQuery = query(
        collection(db, "team_members"), 
        where("teamId", "==", teamId),
        where("userId", "==", userId)
      );
      const memberSnapshot = await getDocs(memberQuery);
      
      if (!memberSnapshot.empty) {
        // Delete member
        await deleteDoc(memberSnapshot.docs[0].ref);
        
        // Update local state
        set((state) => ({
          teams: state.teams.map((team) => 
            team.id === teamId 
              ? { ...team, members: team.members.filter((m) => m.userId !== userId) } 
              : team
          ),
          loading: false
        }));
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      set({ error: "Failed to remove team member", loading: false });
      throw error;
    }
  },
  
  updateMemberRole: async (teamId, userId, role) => {
    try {
      set({ loading: true, error: null });
      
      // Find member document
      const memberQuery = query(
        collection(db, "team_members"), 
        where("teamId", "==", teamId),
        where("userId", "==", userId)
      );
      const memberSnapshot = await getDocs(memberQuery);
      
      if (!memberSnapshot.empty) {
        // Update member role
        await updateDoc(memberSnapshot.docs[0].ref, { role });
        
        // Update local state
        set((state) => ({
          teams: state.teams.map((team) => 
            team.id === teamId 
              ? { 
                  ...team, 
                  members: team.members.map((m) => 
                    m.userId === userId ? { ...m, role } : m
                  ) 
                } 
              : team
          ),
          loading: false
        }));
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error updating team member role:", error);
      set({ error: "Failed to update team member role", loading: false });
      throw error;
    }
  },
}));

export default useTeamStore; 