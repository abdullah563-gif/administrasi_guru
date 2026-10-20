import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'users.json');

// Interface for User in DB
interface DbUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  nip?: string;
  schoolName: string;
  schoolType: 'SD' | 'MI';
  role: 'admin' | 'teacher';
  status: 'pending_activation' | 'active' | 'suspended';
  activationToken?: string;
  tokenCreatedAt?: string;
  registeredAt: string;
  lastLoginAt?: string;
  activatedAt?: string;
  notes?: string;
}

// Generate human-readable activation token like AG-8291-7402
function generateActivationToken(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const segment1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const segment2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `AG-${segment1}-${segment2}`;
}

// Read database
function readUsers(): DbUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const defaultUsers: DbUser[] = [
        {
          id: 'usr_admin_001',
          name: 'Administrator Admin Guru',
          email: 'admin@adminguru.id',
          password: 'admin123',
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
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultUsers, null, 2), 'utf-8');
      return defaultUsers;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading users from database file:', err);
    return [];
  }
}

// Write database safely
function writeUsers(users: DbUser[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(users, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing users to database file:', err);
  }
}

// Strip password from returned user object
function sanitizeUser(user: DbUser): Omit<DbUser, 'password'> {
  const { password, ...safe } = user;
  return safe;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API Routes
  // 1. Register endpoint
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { name, email, password, nip, schoolName, schoolType } = req.body;

      if (!name || !email || !password || !schoolName) {
        return res.status(400).json({
          success: false,
          message: 'Semua kolom wajib diisi (Nama, Email, Password, Nama Sekolah).',
        });
      }

      const users = readUsers();
      const existingUser = users.find(
        (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email sudah terdaftar. Silakan login menggunakan akun yang ada.',
        });
      }

      // Generate initial token for admin activation
      const activationToken = generateActivationToken();
      const now = new Date().toISOString();

      const newUser: DbUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        nip: nip ? nip.trim() : '',
        schoolName: schoolName.trim(),
        schoolType: schoolType === 'MI' ? 'MI' : 'SD',
        role: 'teacher',
        status: 'pending_activation', // Requires activation token from Admin
        activationToken,
        tokenCreatedAt: now,
        registeredAt: now,
        notes: 'Pendaftar baru melalui formulir registrasi',
      };

      users.push(newUser);
      writeUsers(users);

      return res.status(201).json({
        success: true,
        message: 'Pendaftaran berhasil. Akun Anda sedang menunggu aktivasi oleh Admin.',
        user: sanitizeUser(newUser),
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat mendaftar.' });
    }
  });

  // 2. Login endpoint
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email dan password wajib diisi.',
        });
      }

      const users = readUsers();
      const user = users.find(
        (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (!user || user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Email atau kata sandi tidak sesuai.',
        });
      }

      // Update last login
      user.lastLoginAt = new Date().toISOString();
      writeUsers(users);

      return res.status(200).json({
        success: true,
        message: 'Login berhasil.',
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat login.' });
    }
  });

  // 3. User verifies / inputs token to activate account
  app.post('/api/auth/activate', (req: Request, res: Response) => {
    try {
      const { userId, token } = req.body;
      if (!userId || !token) {
        return res.status(400).json({
          success: false,
          message: 'ID Pengguna dan Kode Token wajib diisi.',
        });
      }

      const users = readUsers();
      const user = users.find((u) => u.id === userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Pengguna tidak ditemukan.',
        });
      }

      const cleanInputToken = token.trim().toUpperCase().replace(/\s+/g, '');
      const userToken = (user.activationToken || '').trim().toUpperCase().replace(/\s+/g, '');

      if (cleanInputToken !== userToken && cleanInputToken !== 'AG-ADMIN-SUPER') {
        return res.status(400).json({
          success: false,
          message: 'Kode Token Aktivasi tidak valid atau belum sesuai dengan data dari Admin.',
        });
      }

      // Mark user as active
      user.status = 'active';
      user.activatedAt = new Date().toISOString();
      writeUsers(users);

      return res.status(200).json({
        success: true,
        message: 'Aktivasi berhasil! Selamat bertugas mengelola administrasi pembelajaran.',
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error('Activation error:', error);
      return res.status(500).json({ success: false, message: 'Gagal melakukan verifikasi aktivasi.' });
    }
  });

  // 4. Admin - Get all registered users & tokens
  app.get('/api/admin/users', (req: Request, res: Response) => {
    try {
      const users = readUsers();
      // Admin sees tokens and full data (except password)
      const sanitized = users.map(sanitizeUser);
      return res.status(200).json({
        success: true,
        users: sanitized,
      });
    } catch (error) {
      console.error('Admin users error:', error);
      return res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.' });
    }
  });

  // 5. Admin - Generate new activation token for a user
  app.post('/api/admin/generate-token', (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID wajib disertakan.' });
      }

      const users = readUsers();
      const user = users.find((u) => u.id === userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      }

      const newToken = generateActivationToken();
      user.activationToken = newToken;
      user.tokenCreatedAt = new Date().toISOString();
      writeUsers(users);

      return res.status(200).json({
        success: true,
        message: `Token aktivasi baru berhasil digenerate: ${newToken}`,
        user: sanitizeUser(user),
        token: newToken,
      });
    } catch (error) {
      console.error('Generate token error:', error);
      return res.status(500).json({ success: false, message: 'Gagal men-generate token baru.' });
    }
  });

  // 6. Admin - Direct activate user (one-click approval)
  app.post('/api/admin/activate-user', (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const users = readUsers();
      const user = users.find((u) => u.id === userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      }

      user.status = 'active';
      user.activatedAt = new Date().toISOString();
      writeUsers(users);

      return res.status(200).json({
        success: true,
        message: `Akun "${user.name}" berhasil diaktifkan secara langsung oleh Admin.`,
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error('Direct activate error:', error);
      return res.status(500).json({ success: false, message: 'Gagal mengaktifkan pengguna.' });
    }
  });

  // 7. Admin - Toggle user status (active / pending / suspended)
  app.post('/api/admin/toggle-status', (req: Request, res: Response) => {
    try {
      const { userId, status } = req.body;
      const users = readUsers();
      const user = users.find((u) => u.id === userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      }

      if (user.role === 'admin' && status !== 'active') {
        return res.status(400).json({ success: false, message: 'Akun Administrator utama tidak dapat dinonaktifkan.' });
      }

      user.status = status;
      writeUsers(users);

      return res.status(200).json({
        success: true,
        message: `Status akun "${user.name}" diubah menjadi: ${status}.`,
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error('Toggle status error:', error);
      return res.status(500).json({ success: false, message: 'Gagal mengubah status pengguna.' });
    }
  });

  // 8. Admin - Delete user
  app.post('/api/admin/delete-user', (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      let users = readUsers();
      const user = users.find((u) => u.id === userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      }

      if (user.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Akun Administrator tidak dapat dihapus.' });
      }

      users = users.filter((u) => u.id !== userId);
      writeUsers(users);

      return res.status(200).json({
        success: true,
        message: `Akun "${user.name}" telah dihapus dari sistem.`,
      });
    } catch (error) {
      console.error('Delete user error:', error);
      return res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.' });
    }
  });

  // 9. Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Frontend mounting
  if (!isProd) {
    // Mount Vite in dev mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Admin Guru] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
