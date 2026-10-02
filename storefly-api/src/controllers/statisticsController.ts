import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const getStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM statistics WHERE status = 1 ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getAllStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM statistics ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const createStatistic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { value, label, icon, sort_order, status } = req.body;
    if (!value || !label) {
      res.status(400).json({ success: false, message: 'Value and label are required.' });
      return;
    }
    const result = await execute(
      'INSERT INTO statistics (value, label, icon, sort_order, status) VALUES (?, ?, ?, ?, ?)',
      [value, label, icon, sort_order ?? 0, status ?? 1]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM statistics WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Statistic created.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateStatistic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { value, label, icon, sort_order, status } = req.body;
    await query(
      'UPDATE statistics SET value = ?, label = ?, icon = ?, sort_order = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [value, label, icon, sort_order, status, id]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM statistics WHERE id = ?', [id]);
    res.json({ success: true, message: 'Statistic updated.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteStatistic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM statistics WHERE id = ?', [id]);
    res.json({ success: true, message: 'Statistic deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
