import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM testimonials WHERE status = 1 ORDER BY sort_order ASC, created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getAllTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_name, review, rating, photo, location, sort_order, status } = req.body;
    if (!customer_name || !review) {
      res.status(400).json({ success: false, message: 'Customer name and review are required.' });
      return;
    }
    const result = await execute(
      'INSERT INTO testimonials (customer_name, review, rating, photo, location, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customer_name, review, rating ?? 5, photo, location, sort_order ?? 0, status ?? 1]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM testimonials WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Testimonial created.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { customer_name, review, rating, photo, location, sort_order, status } = req.body;
    await query(
      `UPDATE testimonials SET customer_name = ?, review = ?, rating = ?, photo = ?, location = ?,
       sort_order = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [customer_name, review, rating, photo, location, sort_order, status, id]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM testimonials WHERE id = ?', [id]);
    res.json({ success: true, message: 'Testimonial updated.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM testimonials WHERE id = ?', [id]);
    res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
