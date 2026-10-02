import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { RowDataPacket } from 'mysql2';

const generateBookingNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SF-${year}-${random}`;
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = req.body.customer_name || req.body.name;
    const phone = req.body.customer_phone || req.body.phone;
    const email = req.body.customer_email || req.body.email || null;
    const service_id = req.body.service_id;
    const problem = req.body.issue_description || req.body.problem || req.body.message || '';
    const preferred_date = req.body.preferred_date || null;
    const preferred_time = req.body.preferred_time || null;
    const address = req.body.address || '';
    const message = req.body.message || req.body.issue_description || '';
    
    if (!name || !phone || !service_id) {
      res.status(400).json({ success: false, message: 'Name, phone, and service are required.' });
      return;
    }

    const bookingNumber = generateBookingNumber();
    
    // Check or create customer
    let customerId = null;
    if (phone) {
      const customers = await query<RowDataPacket[]>('SELECT id FROM customers WHERE phone = ?', [phone]);
      if (customers.length > 0) {
        customerId = customers[0].id;
      } else {
        const customerResult = await execute(
          'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
          [name, phone, email, address]
        );
        customerId = customerResult.insertId;
      }
    }

    const result = await execute(
      `INSERT INTO bookings (booking_number, customer_id, service_id, name, phone, email, address, problem, preferred_date, preferred_time, message, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [bookingNumber, customerId, service_id, name, phone, email, address, problem, preferred_date, preferred_time, message]
    );

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully!',
      data: {
        id: result.insertId,
        booking_number: bookingNumber,
        name,
        service_id,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let sql = `SELECT b.*, b.name as customer_name, b.phone as customer_phone, b.email as customer_email, s.name as service_name FROM bookings b 
               LEFT JOIN services s ON b.service_id = s.id`;
    const params: any[] = [];
    
    if (status) {
      sql += ' WHERE b.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);
    
    const rows = await query<RowDataPacket[]>(sql, params);
    
    let countSql = 'SELECT COUNT(*) as total FROM bookings';
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
        limit: Number(limit),
        totalPages: Math.ceil(countResult[0].total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rows = await query<RowDataPacket[]>(
      `SELECT b.*, b.name as customer_name, b.phone as customer_phone, b.email as customer_email, s.name as service_name FROM bookings b 
       LEFT JOIN services s ON b.service_id = s.id 
       WHERE b.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getBookingById = getBooking;

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, admin_note } = req.body;
    await query(
      'UPDATE bookings SET status = ?, admin_note = ?, updated_at = NOW() WHERE id = ?',
      [status, admin_note, id]
    );
    const rows = await query<RowDataPacket[]>('SELECT * FROM bookings WHERE id = ?', [id]);
    res.json({ success: true, message: 'Booking updated.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM bookings WHERE id = ?', [id]);
    res.json({ success: true, message: 'Booking deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getBookingStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await query<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM bookings
    `);
    res.json({ success: true, data: stats[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
