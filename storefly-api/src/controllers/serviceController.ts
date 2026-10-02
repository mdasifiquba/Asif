import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>(
      `SELECT s.*, sc.name as category_name FROM services s 
       LEFT JOIN service_categories sc ON s.category_id = sc.id 
       WHERE s.status = 1 ORDER BY s.sort_order ASC, s.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getServiceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const rows = await query<RowDataPacket[]>(
      `SELECT s.*, sc.name as category_name FROM services s 
       LEFT JOIN service_categories sc ON s.category_id = sc.id 
       WHERE s.slug = ? AND s.status = 1`,
      [slug]
    );
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>(
      `SELECT s.*, sc.name as category_name FROM services s 
       LEFT JOIN service_categories sc ON s.category_id = sc.id 
       ORDER BY s.sort_order ASC, s.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category_id, name, slug, short_description, description, image, icon, price, availability, featured, status, sort_order } = req.body;
    if (!name || !slug) {
      res.status(400).json({ success: false, message: 'Name and slug are required.' });
      return;
    }
    
    const existing = await query<RowDataPacket[]>('SELECT id FROM services WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      res.status(400).json({ success: false, message: 'Service with this slug already exists.' });
      return;
    }

    const result = await execute(
      `INSERT INTO services (category_id, name, slug, short_description, description, image, icon, price, availability, featured, status, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, slug, short_description, description, image, icon, price, availability ?? 'available', featured ?? 0, status ?? 1, sort_order ?? 0]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM services WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Service created.', data: rows[0] });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { category_id, name, slug, short_description, description, image, icon, price, availability, featured, status, sort_order } = req.body;
    
    await query(
      `UPDATE services SET category_id = ?, name = ?, slug = ?, short_description = ?, description = ?,
       image = ?, icon = ?, price = ?, availability = ?, featured = ?, status = ?, sort_order = ?, updated_at = NOW()
       WHERE id = ?`,
      [category_id, name, slug, short_description, description, image, icon, price, availability, featured, status, sort_order, id]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM services WHERE id = ?', [id]);
    res.json({ success: true, message: 'Service updated.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM services WHERE id = ?', [id]);
    res.json({ success: true, message: 'Service deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM service_categories ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, description, sort_order } = req.body;
    const result = await execute(
      'INSERT INTO service_categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)',
      [name, slug, description, sort_order ?? 0]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM service_categories WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Category created.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
