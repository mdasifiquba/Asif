import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>(
      `SELECT * FROM announcements WHERE status = 1 
       AND (start_date IS NULL OR start_date <= NOW()) 
       AND (end_date IS NULL OR end_date >= NOW()) 
       ORDER BY created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getAllAnnouncements = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const createAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { label, text, link, status, start_date, end_date } = req.body;
    if (!text) {
      res.status(400).json({ success: false, message: 'Announcement text is required.' });
      return;
    }
    const result = await execute(
      'INSERT INTO announcements (label, text, link, status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
      [label || 'NEW ANNOUNCEMENT', text, link, status ?? 1, start_date, end_date]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM announcements WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Announcement created.', data: rows[0] });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { label, text, link, status, start_date, end_date } = req.body;
    await query(
      `UPDATE announcements SET label = ?, text = ?, link = ?, status = ?, 
       start_date = ?, end_date = ?, updated_at = NOW() WHERE id = ?`,
      [label, text, link, status, start_date, end_date, id]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM announcements WHERE id = ?', [id]);
    res.json({ success: true, message: 'Announcement updated.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM announcements WHERE id = ?', [id]);
    res.json({ success: true, message: 'Announcement deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
