import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const getFeatures = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM features WHERE status = 1 ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getAllFeatures = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM features ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const createFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, icon, sort_order, status } = req.body;
    if (!title) {
      res.status(400).json({ success: false, message: 'Title is required.' });
      return;
    }
    const result = await execute(
      'INSERT INTO features (title, description, icon, sort_order, status) VALUES (?, ?, ?, ?, ?)',
      [title, description, icon, sort_order ?? 0, status ?? 1]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM features WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Feature created.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, icon, sort_order, status } = req.body;
    await query(
      'UPDATE features SET title = ?, description = ?, icon = ?, sort_order = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [title, description, icon, sort_order, status, id]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM features WHERE id = ?', [id]);
    res.json({ success: true, message: 'Feature updated.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM features WHERE id = ?', [id]);
    res.json({ success: true, message: 'Feature deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
