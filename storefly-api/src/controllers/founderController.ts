import { Request, Response } from 'express';
import { query } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const getFounder = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM founder WHERE status = 1 LIMIT 1');
    res.json({ success: true, data: rows[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateFounder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name, designation, profile_image, experience, description, short_description,
      phone, email, specializations, facebook, instagram, linkedin, status
    } = req.body;

    const rows = await query<RowDataPacket[]>('SELECT id FROM founder LIMIT 1');

    if (rows.length > 0) {
      await query(
        `UPDATE founder SET name = ?, designation = ?, profile_image = ?, experience = ?,
         description = ?, short_description = ?, phone = ?, email = ?, specializations = ?,
         facebook = ?, instagram = ?, linkedin = ?, status = ?, updated_at = NOW() WHERE id = ?`,
        [name, designation, profile_image, experience, description, short_description,
         phone, email, JSON.stringify(specializations), facebook, instagram, linkedin, status ?? 1, rows[0].id]
      );
    } else {
      await query(
        `INSERT INTO founder (name, designation, profile_image, experience, description, short_description,
         phone, email, specializations, facebook, instagram, linkedin, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, designation, profile_image, experience, description, short_description,
         phone, email, JSON.stringify(specializations), facebook, instagram, linkedin, status ?? 1]
      );
    }

    const updated = await query<RowDataPacket[]>('SELECT * FROM founder ORDER BY id DESC LIMIT 1');
    res.json({ success: true, message: 'Founder information updated.', data: updated[0] });
  } catch (error) {
    console.error('Update founder error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
