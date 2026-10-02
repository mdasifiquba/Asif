import { Request, Response } from 'express';
import { query } from '../models/db';
import { RowDataPacket } from 'mysql2';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT setting_key, setting_value FROM settings');
    const settings: Record<string, string> = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    
    // Also get social links
    const socialRows = await query<RowDataPacket[]>('SELECT * FROM social_links ORDER BY sort_order ASC');
    
    res.json({ success: true, data: { ...settings, settings, social_links: socialRows } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settingsData = req.body;
    if (settingsData && settingsData.settings && typeof settingsData.settings === 'object') {
      settingsData = { ...settingsData, ...settingsData.settings };
    }
    
    for (const [key, value] of Object.entries(settingsData)) {
      if (key === 'social_links' || key === 'settings' || typeof value === 'object') continue;
      
      const valStr = value !== null && value !== undefined ? String(value) : '';
      const existing = await query<RowDataPacket[]>('SELECT id FROM settings WHERE setting_key = ?', [key]);
      if (existing.length > 0) {
        await query('UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?', [valStr, key]);
      } else {
        await query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, valStr]);
      }
    }
    
    res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateSocialLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { links } = req.body;
    
    if (Array.isArray(links)) {
      // Clear existing and re-insert
      await query('DELETE FROM social_links');
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        await query(
          'INSERT INTO social_links (platform, url, icon, sort_order, status) VALUES (?, ?, ?, ?, ?)',
          [link.platform, link.url, link.icon, i, link.status ?? 1]
        );
      }
    }
    
    res.json({ success: true, message: 'Social links updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getSeoPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query<RowDataPacket[]>('SELECT * FROM seo_pages ORDER BY page_name ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const updateSeoPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page_name, seo_title, meta_description, keywords, og_image } = req.body;
    
    const existing = await query<RowDataPacket[]>('SELECT id FROM seo_pages WHERE page_name = ?', [page_name]);
    if (existing.length > 0) {
      await query(
        'UPDATE seo_pages SET seo_title = ?, meta_description = ?, keywords = ?, og_image = ?, updated_at = NOW() WHERE page_name = ?',
        [seo_title, meta_description, keywords, og_image, page_name]
      );
    } else {
      await query(
        'INSERT INTO seo_pages (page_name, seo_title, meta_description, keywords, og_image) VALUES (?, ?, ?, ?, ?)',
        [page_name, seo_title, meta_description, keywords, og_image]
      );
    }
    
    res.json({ success: true, message: 'SEO settings updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Dashboard stats
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingCount = await query<RowDataPacket[]>('SELECT COUNT(*) as total FROM bookings');
    const pendingBookings = await query<RowDataPacket[]>('SELECT COUNT(*) as total FROM bookings WHERE status = "pending"');
    const serviceCount = await query<RowDataPacket[]>('SELECT COUNT(*) as total FROM services WHERE status = 1');
    const messageCount = await query<RowDataPacket[]>('SELECT COUNT(*) as total FROM contact_messages WHERE status = "unread"');
    const recentBookings = await query<RowDataPacket[]>(
      `SELECT b.*, s.name as service_name FROM bookings b 
       LEFT JOIN services s ON b.service_id = s.id 
       ORDER BY b.created_at DESC LIMIT 5`
    );
    const recentMessages = await query<RowDataPacket[]>(
      'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5'
    );
    const recentTestimonials = await query<RowDataPacket[]>(
      'SELECT * FROM testimonials ORDER BY created_at DESC LIMIT 5'
    );
    
    res.json({
      success: true,
      data: {
        total_bookings: bookingCount[0].total,
        pending_bookings: pendingBookings[0].total,
        total_services: serviceCount[0].total,
        unread_messages: messageCount[0].total,
        recent_bookings: recentBookings,
        recent_messages: recentMessages,
        recent_testimonials: recentTestimonials
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
