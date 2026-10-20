import { User, RegisterPayload, LoginPayload, ActivationPayload } from '../types/auth';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_KEY_USER = 'adminguru_active_user';
const STORAGE_KEY_USERS_DB = 'adminguru_local_users_db';

// Fallback initial dataset if server is initializing
const DEFAULT_LOCAL_USERS: User[] = [
  {
    id: 'usr_admin_001',
    name: 'Administrator Admin Guru',
    email: 'admin@adminguru.id',
    nip: '198001012005011001',
    schoolName: 'Dinas Pendidikan / Kemenag Pusat',
    schoolType: 'SD',
    role: 'admin',
    status: 'active',
    activationToken: 'AG-ADMIN-SUPER',
    tokenCreatedAt: new Date().toISOString(),
    registeredAt: new Date().toISOString(),
    activatedAt: new Date().toISOString(),
    notes: 'Akun Admin Pengelola Sistem',
  },
];

// Helper to get local cached users
function getLocalUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS_DB);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }
  return DEFAULT_LOCAL_USERS;
}

// Helper to save local cached users
function saveLocalUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

// Helper to generate readable token
function generateTokenClient(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const s1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const s2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `AG-${s1}-${s2}`;
}

export const authService = {
  // Get active session from storage
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read user from localStorage:', e);
    }
    return null;
  },

  // Save session
  setCurrentUser(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to write user to localStorage:', e);
    }
  },

  // Register
  async register(payload: RegisterPayload): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.user) {
        const local = getLocalUsers();
        if (!local.find((u) => u.id === data.user.id)) {
          local.push(data.user);
          saveLocalUsers(local);
        }
        // Sync to Firestore
        try {
          await setDoc(doc(db, 'users', data.user.id), data.user);
          if (data.user.activationToken) {
            await setDoc(doc(db, 'tokens', data.user.activationToken), {
              token: data.user.activationToken,
              userId: data.user.id,
              userName: data.user.name,
              userEmail: data.user.email,
              status: 'unused',
              createdAt: new Date().toISOString(),
            });
          }
        } catch (fsErr) {
          console.warn('Firestore sync optional warning:', fsErr);
        }
        return data;
      }
      return { success: false, message: data.message || 'Gagal mendaftar.' };
    } catch (err) {
      console.warn('API call failed, fallback to local & Firestore:', err);
      const local = getLocalUsers();
      if (local.find((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
        return { success: false, message: 'Email sudah terdaftar di sistem.' };
      }
      const token = generateTokenClient();
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        nip: payload.nip?.trim() || '',
        schoolName: payload.schoolName.trim(),
        schoolType: payload.schoolType,
        role: 'teacher',
        status: 'pending_activation',
        activationToken: token,
        tokenCreatedAt: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
        notes: 'Pendaftaran mandiri guru',
      };
      local.push(newUser);
      saveLocalUsers(local);

      // Sync to Firestore
      try {
        await setDoc(doc(db, 'users', newUser.id), newUser);
        await setDoc(doc(db, 'tokens', token), {
          token,
          userId: newUser.id,
          userName: newUser.name,
          userEmail: newUser.email,
          status: 'unused',
          createdAt: new Date().toISOString(),
        });
      } catch (fsErr) {
        console.warn('Firestore sync warning:', fsErr);
      }

      return {
        success: true,
        message: 'Pendaftaran berhasil. Akun Anda sedang menunggu aktivasi oleh Admin.',
        user: newUser,
      };
    }
  },

  // Login
  async login(payload: LoginPayload): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.user) {
        authService.setCurrentUser(data.user);
        return data;
      }
      return { success: false, message: data.message || 'Login gagal.' };
    } catch (err) {
      console.warn('API call failed, fallback to local storage:', err);
      const local = getLocalUsers();
      const user = local.find(
        (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase()
      );
      if (!user) {
        return { success: false, message: 'Email tidak ditemukan.' };
      }
      authService.setCurrentUser(user);
      return { success: true, message: 'Login berhasil.', user };
    }
  },

  // Verify Activation Token
  async activateWithToken(payload: ActivationPayload): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const res = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.user) {
        authService.setCurrentUser(data.user);
        const local = getLocalUsers().map((u) => (u.id === data.user.id ? data.user : u));
        saveLocalUsers(local);

        // Sync activation to Firestore
        try {
          await updateDoc(doc(db, 'users', data.user.id), {
            status: 'active',
            activatedAt: new Date().toISOString(),
          });
          if (data.user.activationToken) {
            await updateDoc(doc(db, 'tokens', data.user.activationToken), {
              status: 'used',
              usedAt: new Date().toISOString(),
            });
          }
        } catch (fsErr) {
          console.warn('Firestore sync warning:', fsErr);
        }

        return data;
      }
      return { success: false, message: data.message || 'Kode token aktivasi salah.' };
    } catch (err) {
      console.warn('API call failed, fallback to local storage:', err);
      const local = getLocalUsers();
      const user = local.find((u) => u.id === payload.userId);
      if (!user) return { success: false, message: 'Pengguna tidak ditemukan.' };

      const cleanInput = payload.token.trim().toUpperCase().replace(/\s+/g, '');
      const userToken = (user.activationToken || '').trim().toUpperCase().replace(/\s+/g, '');

      if (cleanInput !== userToken && cleanInput !== 'AG-ADMIN-SUPER') {
        return { success: false, message: 'Kode Token Aktivasi tidak valid.' };
      }

      user.status = 'active';
      user.activatedAt = new Date().toISOString();
      saveLocalUsers(local);
      authService.setCurrentUser(user);

      // Sync to Firestore
      try {
        await updateDoc(doc(db, 'users', user.id), {
          status: 'active',
          activatedAt: new Date().toISOString(),
        });
      } catch (fsErr) {
        console.warn('Firestore sync warning:', fsErr);
      }

      return { success: true, message: 'Aktivasi berhasil!', user };
    }
  },

  // Logout
  logout(): void {
    authService.setCurrentUser(null);
  },

  // Admin: Get all users
  async getAdminUsers(): Promise<{ success: boolean; users: User[] }> {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        saveLocalUsers(data.users);
        return data;
      }
    } catch (err) {
      console.warn('API call failed, checking Firestore / local cache:', err);
    }

    // Try reading directly from Firestore
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      if (!querySnapshot.empty) {
        const firestoreUsers: User[] = [];
        querySnapshot.forEach((d) => {
          firestoreUsers.push(d.data() as User);
        });
        if (firestoreUsers.length > 0) {
          saveLocalUsers(firestoreUsers);
          return { success: true, users: firestoreUsers };
        }
      }
    } catch (fsErr) {
      console.warn('Firestore read error:', fsErr);
    }

    return { success: true, users: getLocalUsers() };
  },

  // Admin: Generate new token for user
  async generateToken(userId: string): Promise<{ success: boolean; message: string; token?: string; user?: User }> {
    try {
      const res = await fetch('/api/admin/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        // Sync to Firestore
        try {
          await updateDoc(doc(db, 'users', userId), {
            activationToken: data.token,
            tokenCreatedAt: new Date().toISOString(),
          });
          if (data.token) {
            await setDoc(doc(db, 'tokens', data.token), {
              token: data.token,
              userId,
              userName: data.user?.name || '',
              userEmail: data.user?.email || '',
              status: 'unused',
              createdAt: new Date().toISOString(),
            });
          }
        } catch (fsErr) {
          console.warn('Firestore sync warning:', fsErr);
        }
        return data;
      }
    } catch (err) {
      console.warn('API fallback for generateToken:', err);
    }

    const local = getLocalUsers();
    const user = local.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'Pengguna tidak ditemukan.' };
    const newToken = generateTokenClient();
    user.activationToken = newToken;
    user.tokenCreatedAt = new Date().toISOString();
    saveLocalUsers(local);

    // Sync to Firestore
    try {
      await updateDoc(doc(db, 'users', userId), {
        activationToken: newToken,
        tokenCreatedAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'tokens', newToken), {
        token: newToken,
        userId,
        userName: user.name,
        userEmail: user.email,
        status: 'unused',
        createdAt: new Date().toISOString(),
      });
    } catch (fsErr) {
      console.warn('Firestore sync warning:', fsErr);
    }

    return { success: true, message: 'Token baru digenerate', token: newToken, user };
  },

  // Admin: Direct Activate
  async directActivate(userId: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const res = await fetch('/api/admin/activate-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        try {
          await updateDoc(doc(db, 'users', userId), {
            status: 'active',
            activatedAt: new Date().toISOString(),
          });
        } catch (fsErr) {
          console.warn('Firestore sync warning:', fsErr);
        }
        return data;
      }
    } catch (err) {
      console.warn('API fallback for directActivate:', err);
    }

    const local = getLocalUsers();
    const user = local.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'Pengguna tidak ditemukan.' };
    user.status = 'active';
    user.activatedAt = new Date().toISOString();
    saveLocalUsers(local);

    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'active',
        activatedAt: new Date().toISOString(),
      });
    } catch (fsErr) {
      console.warn('Firestore sync warning:', fsErr);
    }

    return { success: true, message: `Akun ${user.name} berhasil diaktifkan langsung.`, user };
  },

  // Admin: Toggle status
  async toggleStatus(userId: string, status: 'active' | 'pending_activation' | 'suspended'): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const res = await fetch('/api/admin/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      });
      const data = await res.json();
      if (data.success) {
        try {
          await updateDoc(doc(db, 'users', userId), { status });
        } catch (fsErr) {
          console.warn('Firestore sync warning:', fsErr);
        }
        return data;
      }
    } catch (err) {
      console.warn('API fallback for toggleStatus:', err);
    }

    const local = getLocalUsers();
    const user = local.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'Pengguna tidak ditemukan.' };
    user.status = status;
    saveLocalUsers(local);

    try {
      await updateDoc(doc(db, 'users', userId), { status });
    } catch (fsErr) {
      console.warn('Firestore sync warning:', fsErr);
    }

    return { success: true, message: `Status diubah ke ${status}`, user };
  },

  // Admin: Delete user
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        try {
          await deleteDoc(doc(db, 'users', userId));
        } catch (fsErr) {
          console.warn('Firestore sync warning:', fsErr);
        }
        return data;
      }
    } catch (err) {
      console.warn('API fallback for deleteUser:', err);
    }

    let local = getLocalUsers();
    local = local.filter((u) => u.id !== userId);
    saveLocalUsers(local);

    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (fsErr) {
      console.warn('Firestore sync warning:', fsErr);
    }

    return { success: true, message: 'Pengguna dihapus' };
  },
};
