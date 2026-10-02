import { Request, Response } from 'express';
import { query } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const getHero = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM hero WHERE status = 1 ORDER BY id DESC LIMIT 1');
    res.json({ success: true, data: rows[0] || null });
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateHero = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, button_text, button_url, background_image, overlay_opacity, status } = req.body;
    const rows = await query<RowDataPacket[]>('SELECT id FROM hero LIMIT 1');
    
    if (rows.length > 0) {
      await query(
        `UPDATE hero SET title = ?, subtitle = ?, button_text = ?, button_url = ?, 
         background_image = ?, overlay_opacity = ?, status = ?, updated_at = NOW() WHERE id = ?`,
        [title, subtitle, button_text, button_url, background_image, overlay_opacity ?? 0.5, status ?? 1, rows[0].id]
      );
    } else {
      await query(
        `INSERT INTO hero (title, subtitle, button_text, button_url, background_image, overlay_opacity, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, subtitle, button_text, button_url, background_image, overlay_opacity ?? 0.5, status ?? 1]
      );
    }
    
    const updated = await query<RowDataPacket[]>('SELECT * FROM hero ORDER BY id DESC LIMIT 1');
    res.json({ success: true, message: 'Hero updated successfully.', data: updated[0] });
  } catch (error) {
    console.error('Update hero error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
