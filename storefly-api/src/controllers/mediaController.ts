import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { RowDataPacket } from 'mysql2';
import path from 'path';
import fs from 'fs';

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }
    
    const { filename, originalname, mimetype, size } = req.file;
    const url = `/uploads/${filename}`;
    
    const result = await execute(
      'INSERT INTO media (filename, original_name, mime_type, size, url) VALUES (?, ?, ?, ?, ?)',
      [filename, originalname, mimetype, size, url]
    );
    
    const rows = await query<RowDataPacket[]>('SELECT * FROM media WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'File uploaded successfully.', data: rows[0] });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const rows = await query<RowDataPacket[]>(
      'SELECT * FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [Number(limit), offset]
    );
    const countResult = await query<RowDataPacket[]>('SELECT COUNT(*) as total FROM media');
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: countResult[0].total,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rows = await query<RowDataPacket[]>('SELECT * FROM media WHERE id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Media not found.' });
      return;
    }
    
    // Delete file from disk
    const filePath = path.join(__dirname, '../../uploads', rows[0].filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await query('DELETE FROM media WHERE id = ?', [id]);
    res.json({ success: true, message: 'Media deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
