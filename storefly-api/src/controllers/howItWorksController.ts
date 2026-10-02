import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const getHowItWorks = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM how_it_works WHERE status = 1 ORDER BY step_number ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getAllHowItWorks = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM how_it_works ORDER BY step_number ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const createStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const { step_number, title, description, icon, status } = req.body;
    if (!title || !step_number) {
      res.status(400).json({ success: false, message: 'Step number and title are required.' });
      return;
    }
    const result = await execute(
      'INSERT INTO how_it_works (step_number, title, description, icon, status) VALUES (?, ?, ?, ?, ?)',
      [step_number, title, description, icon, status ?? 1]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM how_it_works WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Step created.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { step_number, title, description, icon, status } = req.body;
    await query(
      'UPDATE how_it_works SET step_number = ?, title = ?, description = ?, icon = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [step_number, title, description, icon, status, id]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM how_it_works WHERE id = ?', [id]);
    res.json({ success: true, message: 'Step updated.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM how_it_works WHERE id = ?', [id]);
    res.json({ success: true, message: 'Step deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
