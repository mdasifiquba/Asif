import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !message) {
      res.status(400).json({ success: false, message: 'Name and message are required.' });
      return;
    }
    const result = await execute(
      'INSERT INTO contact_messages (name, phone, email, subject, message, status) VALUES (?, ?, ?, ?, ?, "unread")',
      [name, phone, email, subject, message]
    );
    res.status(201).json({ success: true, message: 'Message sent successfully! We will contact you soon.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let sql = 'SELECT * FROM contact_messages';
    const params: any[] = [];
    
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);
    
    const rows = await query<RowDataPacket[]>(sql, params);
    
    let countSql = 'SELECT COUNT(*) as total FROM contact_messages';
    const countParams: any[] = [];
    if (status) {
      countSql += ' WHERE status = ?';
      countParams.push(status);
    }
    const countResult = await query<RowDataPacket[]>(countSql, countParams);
    
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

export const getMessageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Mark as read when viewing
    await query('UPDATE contact_messages SET status = "read" WHERE id = ? AND status = "unread"', [id]);
    const rows = await query<RowDataPacket[]>('SELECT * FROM contact_messages WHERE id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Message not found.' });
      return;
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await query('UPDATE contact_messages SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Message status updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
