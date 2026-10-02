import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const getComingSoon = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM coming_soon WHERE status = 1 ORDER BY launch_date ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getAllComingSoon = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM coming_soon ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const createComingSoon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, image, launch_date, category, status } = req.body;
    if (!title) {
      res.status(400).json({ success: false, message: 'Title is required.' });
      return;
    }
    const result = await execute(
      'INSERT INTO coming_soon (title, description, image, launch_date, category, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image, launch_date, category, status ?? 1]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM coming_soon WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Item created.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateComingSoon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, image, launch_date, category, status } = req.body;
    await query(
      'UPDATE coming_soon SET title = ?, description = ?, image = ?, launch_date = ?, category = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [title, description, image, launch_date, category, status, id]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM coming_soon WHERE id = ?', [id]);
    res.json({ success: true, message: 'Item updated.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteComingSoon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM coming_soon WHERE id = ?', [id]);
    res.json({ success: true, message: 'Item deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
