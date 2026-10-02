import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../models/db';
import { AuthRequest } from '../middleware/auth';
import { RowDataPacket } from 'mysql2';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const admins = await query<RowDataPacket[]>('SELECT * FROM admins WHERE email = ? AND status = "active"', [email]);
    if (admins.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const admin = admins[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );

    await query('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id]);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admins = await query<RowDataPacket[]>(
      'SELECT id, name, email, role, last_login, created_at FROM admins WHERE id = ?',
      [req.admin?.id]
    );
    if (admins.length === 0) {
      res.status(404).json({ success: false, message: 'Admin not found.' });
      return;
    }
    res.json({ success: true, data: admins[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      res.status(400).json({ success: false, message: 'Current and new password are required.' });
      return;
    }
    if (new_password.length < 8) {
      res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
      return;
    }

    const admins = await query<RowDataPacket[]>('SELECT * FROM admins WHERE id = ?', [req.admin?.id]);
    if (admins.length === 0) {
      res.status(404).json({ success: false, message: 'Admin not found.' });
      return;
    }

    const validPassword = await bcrypt.compare(current_password, admins[0].password_hash);
    if (!validPassword) {
      res.status(401).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);
    await query('UPDATE admins SET password_hash = ?, updated_at = NOW() WHERE id = ?', [hashedPassword, req.admin?.id]);

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
