import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306');
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'storefly_db';

async function seed() {
  console.log('🌱 Starting Storefly database seeding...\n');

  // Connect without database first to create it
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });

  // Create database
  console.log('📦 Creating database...');
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.query(`USE \`${DB_NAME}\``);
  console.log(`   ✓ Database '${DB_NAME}' ready\n`);

  // Create tables
  console.log('📋 Creating tables...');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('super_admin', 'admin', 'staff') DEFAULT 'admin',
      status ENUM('active', 'inactive') DEFAULT 'active',
      last_login DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ admins');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS hero (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      subtitle TEXT,
      button_text VARCHAR(100),
      button_url VARCHAR(255),
      background_image VARCHAR(500),
      overlay_opacity DECIMAL(3,2) DEFAULT 0.50,
      status TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ hero');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(100) DEFAULT 'NEW ANNOUNCEMENT',
      text TEXT NOT NULL,
      link VARCHAR(500),
      status TINYINT(1) DEFAULT 1,
      start_date DATETIME NULL,
      end_date DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ announcements');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS statistics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      value VARCHAR(50) NOT NULL,
      label VARCHAR(100) NOT NULL,
      icon VARCHAR(100),
      sort_order INT DEFAULT 0,
      status TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ statistics');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS service_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE,
      description TEXT,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ service_categories');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT,
      name VARCHAR(200) NOT NULL,
      slug VARCHAR(200) UNIQUE NOT NULL,
      short_description TEXT,
      description LONGTEXT,
      image VARCHAR(500),
      icon VARCHAR(100),
      price VARCHAR(100),
      availability ENUM('available', 'unavailable', 'coming_soon') DEFAULT 'available',
      featured TINYINT(1) DEFAULT 0,
      status TINYINT(1) DEFAULT 1,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL
    )
  `);
  console.log('   ✓ services');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      phone VARCHAR(20),
      email VARCHAR(150),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_phone (phone)
    )
  `);
  console.log('   ✓ customers');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_number VARCHAR(20) UNIQUE NOT NULL,
      customer_id INT,
      service_id INT,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(150),
      address TEXT,
      problem TEXT,
      preferred_date DATE,
      preferred_time TIME,
      message TEXT,
      status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
      admin_note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
      INDEX idx_status (status),
      INDEX idx_booking_number (booking_number)
    )
  `);
  console.log('   ✓ bookings');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS features (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      icon VARCHAR(100),
      sort_order INT DEFAULT 0,
      status TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ features');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS how_it_works (
      id INT AUTO_INCREMENT PRIMARY KEY,
      step_number INT NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      icon VARCHAR(100),
      status TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ how_it_works');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS founder (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      designation VARCHAR(200),
      profile_image VARCHAR(500),
      experience VARCHAR(50),
      description LONGTEXT,
      short_description TEXT,
      phone VARCHAR(20),
      email VARCHAR(150),
      specializations JSON,
      facebook VARCHAR(500),
      instagram VARCHAR(500),
      linkedin VARCHAR(500),
      status TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ founder');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(100) NOT NULL,
      review TEXT NOT NULL,
      rating INT DEFAULT 5,
      photo VARCHAR(500),
      location VARCHAR(200),
      sort_order INT DEFAULT 0,
      status TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ testimonials');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(150),
      subject VARCHAR(300),
      message TEXT NOT NULL,
      status ENUM('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_status (status)
    )
  `);
  console.log('   ✓ contact_messages');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS coming_soon (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      image VARCHAR(500),
      launch_date DATE,
      category VARCHAR(100),
      status TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ coming_soon');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS media (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255),
      mime_type VARCHAR(100),
      size INT,
      url VARCHAR(500) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ media');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ settings');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS social_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      platform VARCHAR(50) NOT NULL,
      url VARCHAR(500),
      icon VARCHAR(100),
      sort_order INT DEFAULT 0,
      status TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ social_links');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS seo_pages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      page_name VARCHAR(100) UNIQUE NOT NULL,
      seo_title VARCHAR(300),
      meta_description TEXT,
      keywords TEXT,
      og_image VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✓ seo_pages\n');

  // ========================
  // SEED DATA
  // ========================
  console.log('🌿 Seeding initial data...\n');

  // Admin user
  const adminExists = await conn.query<any[]>('SELECT id FROM admins LIMIT 1');
  if (adminExists[0].length === 0) {
    const hashedPassword = await bcrypt.hash('StoreF1y@2026', 12);
    await conn.query(
      'INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Store Fly Admin', 'admin@storefly.in', hashedPassword, 'super_admin']
    );
    console.log('   ✓ Admin user created (admin@storefly.in / StoreF1y@2026)');
  } else {
    console.log('   → Admin user already exists, skipping');
  }

  // Hero
  const heroExists = await conn.query<any[]>('SELECT id FROM hero LIMIT 1');
  if (heroExists[0].length === 0) {
    await conn.query(
      'INSERT INTO hero (title, subtitle, button_text, button_url, overlay_opacity, status) VALUES (?, ?, ?, ?, ?, ?)',
      ['Expert IT & Security Solutions', 'Your trusted partner for IT services, security systems, and computer solutions in Jamui', 'Explore Services', '#services', 0.6, 1]
    );
    console.log('   ✓ Hero section');
  }

  // Announcement
  const annExists = await conn.query<any[]>('SELECT id FROM announcements LIMIT 1');
  if (annExists[0].length === 0) {
    await conn.query(
      `INSERT INTO announcements (label, text, status) VALUES (?, ?, ?)`,
      ['NEW ANNOUNCEMENT', "Jamui's biggest Multi-Service Hub is launching soon! Are you a skilled professional?", 1]
    );
    console.log('   ✓ Announcement');
  }

  // Statistics
  const statsExist = await conn.query<any[]>('SELECT id FROM statistics LIMIT 1');
  if (statsExist[0].length === 0) {
    const stats = [
      ['300+', 'Happy Clients', 'users', 1],
      ['500+', 'Repairs Done', 'wrench', 2],
      ['100%', 'Satisfaction', 'thumbs-up', 3],
      ['24/7', 'Support', 'headphones', 4]
    ];
    for (const [value, label, icon, sort] of stats) {
      await conn.query(
        'INSERT INTO statistics (value, label, icon, sort_order, status) VALUES (?, ?, ?, ?, 1)',
        [value, label, icon, sort]
      );
    }
    console.log('   ✓ Statistics (4 items)');
  }

  // Service Categories
  const catExists = await conn.query<any[]>('SELECT id FROM service_categories LIMIT 1');
  let itCatId = 1, secCatId = 2;
  if (catExists[0].length === 0) {
    const [itResult] = await conn.query<any>(
      'INSERT INTO service_categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)',
      ['IT Services', 'it-services', 'Computer, laptop, and printer repair services', 1]
    );
    itCatId = itResult.insertId;
    const [secResult] = await conn.query<any>(
      'INSERT INTO service_categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)',
      ['Security Services', 'security-services', 'CCTV, biometric, and security system services', 2]
    );
    secCatId = secResult.insertId;
    console.log('   ✓ Service categories (2)');
  }

  // Services
  const svcExists = await conn.query<any[]>('SELECT id FROM services LIMIT 1');
  if (svcExists[0].length === 0) {
    const services = [
      {
        cat: itCatId, name: 'Printer Services', slug: 'printer-services',
        short_desc: 'Cartridge refilling, drum replacement, paper jam fixing, and complete printer support.',
        desc: '<h3>Our Printer Services Include:</h3><ul><li>✓ Cartridge Refill & Replacement</li><li>✓ Drum Replacement</li><li>✓ Paper Jam Fixing</li><li>✓ Printer Maintenance & Repair</li><li>✓ New Printer Setup</li><li>✓ Network Printer Configuration</li></ul><p>We service all major brands including HP, Canon, Epson, Brother, and Samsung.</p><p><strong>Starting From ₹200</strong></p>',
        icon: 'printer', price: '₹200', sort: 1
      },
      {
        cat: itCatId, name: 'Laptop Services', slug: 'laptop-services',
        short_desc: 'Screen replacement, battery replacement, keyboard repair, software installation & hardware repair.',
        desc: '<h3>Our Laptop Services Include:</h3><ul><li>✓ Screen Replacement</li><li>✓ Battery Replacement</li><li>✓ Keyboard Repair</li><li>✓ Software Installation</li><li>✓ Hardware Repair & Upgrade</li><li>✓ Virus Removal</li><li>✓ Data Recovery</li></ul><p>Expert technicians for all laptop brands.</p><p><strong>Starting From ₹300</strong></p>',
        icon: 'laptop', price: '₹300', sort: 2
      },
      {
        cat: itCatId, name: 'PC Services', slug: 'pc-services',
        short_desc: 'Custom PC building, hardware upgrade, virus removal, Windows installation & troubleshooting.',
        desc: '<h3>Our PC Services Include:</h3><ul><li>✓ Custom PC Building</li><li>✓ Hardware Upgrade</li><li>✓ Virus Removal</li><li>✓ Windows Installation</li><li>✓ Troubleshooting</li><li>✓ Data Backup & Recovery</li><li>✓ Performance Optimization</li></ul><p><strong>Starting From ₹250</strong></p>',
        icon: 'monitor', price: '₹250', sort: 3
      },
      {
        cat: secCatId, name: 'CCTV Services', slug: 'cctv-services',
        short_desc: 'CCTV installation, DVR configuration, wiring, and mobile viewing setup.',
        desc: '<h3>Our CCTV Services Include:</h3><ul><li>✓ CCTV Camera Installation</li><li>✓ DVR/NVR Configuration</li><li>✓ Professional Wiring</li><li>✓ Mobile Viewing Setup</li><li>✓ Night Vision Cameras</li><li>✓ Remote Monitoring</li></ul><p>Complete surveillance solutions for homes and businesses.</p><p><strong>Starting From ₹1,500</strong></p>',
        icon: 'camera', price: '₹1,500', sort: 4
      },
      {
        cat: secCatId, name: 'Biometric Services', slug: 'biometric-services',
        short_desc: 'Fingerprint attendance machine, face attendance, access control & attendance software.',
        desc: '<h3>Our Biometric Services Include:</h3><ul><li>✓ Fingerprint Attendance Machine</li><li>✓ Face Recognition Systems</li><li>✓ Access Control Systems</li><li>✓ Attendance Software Setup</li><li>✓ Integration & Support</li></ul><p>Modern biometric solutions for offices, schools, and institutions.</p><p><strong>Starting From ₹3,000</strong></p>',
        icon: 'fingerprint', price: '₹3,000', sort: 5
      },
      {
        cat: secCatId, name: 'PA System Services', slug: 'pa-system-services',
        short_desc: 'Public announcement, speaker installation, amplifier & school/office audio setup.',
        desc: '<h3>Our PA System Services Include:</h3><ul><li>✓ Public Announcement Systems</li><li>✓ Speaker Installation</li><li>✓ Amplifier Setup</li><li>✓ School & Office Audio Systems</li><li>✓ Conference Room Audio</li></ul><p>Professional audio solutions for every need.</p><p><strong>Starting From ₹2,000</strong></p>',
        icon: 'volume-2', price: '₹2,000', sort: 6
      }
    ];

    for (const svc of services) {
      await conn.query(
        `INSERT INTO services (category_id, name, slug, short_description, description, icon, price, availability, featured, status, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'available', 1, 1, ?)`,
        [svc.cat, svc.name, svc.slug, svc.short_desc, svc.desc, svc.icon, svc.price, svc.sort]
      );
    }
    console.log('   ✓ Services (6 items)');
  }

  // Features (Why Choose Us)
  const featExists = await conn.query<any[]>('SELECT id FROM features LIMIT 1');
  if (featExists[0].length === 0) {
    const features = [
      ['Doorstep Service', 'Expert help when you need it, right from your home, office or shop.', 'home', 1],
      ['Genuine Parts', 'We provide quality replacement parts for your devices.', 'shield-check', 2],
      ['Expert Handling', 'Experienced technicians handle your devices with proper care.', 'award', 3],
      ['Fair Pricing', 'Transparent service pricing without hidden charges.', 'dollar-sign', 4]
    ];
    for (const [title, desc, icon, sort] of features) {
      await conn.query(
        'INSERT INTO features (title, description, icon, sort_order, status) VALUES (?, ?, ?, ?, 1)',
        [title, desc, icon, sort]
      );
    }
    console.log('   ✓ Features (4 items)');
  }

  // How It Works
  const hiwExists = await conn.query<any[]>('SELECT id FROM how_it_works LIMIT 1');
  if (hiwExists[0].length === 0) {
    const steps = [
      [1, 'Book Online', 'Fill the form or call us to schedule a service appointment.', 'calendar'],
      [2, 'Expert Visit', 'Our skilled technician visits your location at the scheduled time.', 'user-check'],
      [3, 'Problem Solved', 'Your device is tested, fixed, and delivered with a satisfaction guarantee.', 'check-circle']
    ];
    for (const [num, title, desc, icon] of steps) {
      await conn.query(
        'INSERT INTO how_it_works (step_number, title, description, icon, status) VALUES (?, ?, ?, ?, 1)',
        [num, title, desc, icon]
      );
    }
    console.log('   ✓ How It Works (3 steps)');
  }

  // Founder
  const founderExists = await conn.query<any[]>('SELECT id FROM founder LIMIT 1');
  if (founderExists[0].length === 0) {
    await conn.query(
      `INSERT INTO founder (name, designation, experience, description, short_description, phone, email, specializations, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        'Kunal Sharma',
        'Founder & Lead IT Expert',
        '7+',
        'Founded by Kunal Sharma, NETCET is Jamui\'s trusted destination for all IT infrastructure, CCTV, and computer needs. With 7+ years of specialized experience in computer hardware, networking, CCTV installation, and biometric systems, Kunal has built a reputation for delivering reliable solutions at fair prices. Under his leadership, NETCET has served 300+ satisfied clients across Jamui and surrounding areas.',
        'Jamui\'s premier IT, Computer & security solutions expert with 7+ years of experience.',
        '9876543210',
        'contact@netcet.in',
        JSON.stringify(['Biometric Systems', 'Advanced Hardware', 'CCTV Installation', 'Network Setup'])
      ]
    );
    console.log('   ✓ Founder profile');
  }

  // Testimonials
  const testExists = await conn.query<any[]>('SELECT id FROM testimonials LIMIT 1');
  if (testExists[0].length === 0) {
    const testimonials = [
      ['Rahul Verma', 'Excellent service! Got my laptop repaired quickly and at a very reasonable price. Highly recommended!', 5, 'Jamui'],
      ['Priya Singh', 'NETCET installed CCTV cameras at my shop. Professional work and great after-sales support.', 5, 'Jamui'],
      ['Amit Kumar', 'Best computer repair service in Jamui. Quick response and genuine parts. Very satisfied!', 5, 'Jamui'],
      ['Sunita Devi', 'Got biometric attendance system installed at our school. Very helpful and professional team.', 4, 'Jamui']
    ];
    for (let i = 0; i < testimonials.length; i++) {
      await conn.query(
        'INSERT INTO testimonials (customer_name, review, rating, location, sort_order, status) VALUES (?, ?, ?, ?, ?, 1)',
        [testimonials[i][0], testimonials[i][1], testimonials[i][2], testimonials[i][3], i + 1]
      );
    }
    console.log('   ✓ Testimonials (4 items)');
  }

  // Settings
  const settingsExist = await conn.query<any[]>('SELECT id FROM settings LIMIT 1');
  if (settingsExist[0].length === 0) {
    const settings = [
      ['business_name', 'NETCET'],
      ['business_tagline', 'NETCET COMPUTERS - CCTV IT AND COMPUTER'],
      ['phone', '+91 821 010 1223'],
      ['whatsapp', '+91 821 010 1223'],
      ['email', 'contact@netcet.in'],
      ['address', 'Near Luv Kush Gas Agency, Jamui Khaira Kawakol Rd, Jamui, Bihar - 811307'],
      ['opening_hours', 'Mon-Sat: 9:00 AM - 8:00 PM'],
      ['google_map_url', 'https://www.google.com/maps/place/NETCET+COMPUTERS+-+CCTV+IT+AND+COMPUTER,+luv+kush+gas+agency,+near,+Jamui+Khaira+Kawakol+Rd,+Jamui,+Bihar+811307/data=!4m2!3m1!1s0x899dbc934d196d2d:0x9ff4ff75a4af9869!18m1!1e1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI2LjM3LjUYACDXggMqnwEsOTQyNjc3MjcsOTQyOTIxOTUsOTQyOTk1MzIsMTAwNzk2NDk4LDEwMDc5Nzc2MSwxMDA3OTU2MjUsOTQyODA1NzYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsOTQyNzk2MTksMTAwODM1NzA0LDEwMDgyNTAyMSwxMDA4MjI0OTRCAklO&skid=b32864e2-db1e-43b0-8981-ae44038f98c1&g_st=ac'],
      ['footer_description', 'NETCET COMPUTERS - CCTV IT AND COMPUTER is Jamui\'s premier destination for top-tier IT infrastructure, computer repairs & security solutions, providing comprehensive tech services.'],
      ['copyright_text', '© 2026 NETCET COMPUTERS - CCTV IT AND COMPUTER. All Rights Reserved.'],
      ['designed_by', 'NETCET Team']
    ];
    for (const [key, value] of settings) {
      await conn.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, value]);
    }
    console.log('   ✓ Settings');
  }

  // Social Links
  const socialExists = await conn.query<any[]>('SELECT id FROM social_links LIMIT 1');
  if (socialExists[0].length === 0) {
    const links = [
      ['Facebook', 'https://facebook.com/netcet', 'facebook', 1],
      ['Instagram', 'https://instagram.com/netcet', 'instagram', 2],
      ['Twitter', 'https://twitter.com/netcet', 'twitter', 3],
      ['WhatsApp', 'https://wa.me/918210101223', 'message-circle', 4],
      ['Email', 'mailto:contact@netcet.in', 'mail', 5]
    ];
    for (const [platform, url, icon, sort] of links) {
      await conn.query(
        'INSERT INTO social_links (platform, url, icon, sort_order, status) VALUES (?, ?, ?, ?, 1)',
        [platform, url, icon, sort]
      );
    }
    console.log('   ✓ Social links');
  }

  // Coming Soon
  const csExists = await conn.query<any[]>('SELECT id FROM coming_soon LIMIT 1');
  if (csExists[0].length === 0) {
    const items = [
      ['Smart Home Automation', 'Complete home automation solutions including smart lighting, smart locks, and voice-controlled systems.', '2026-12-01', 'Technology'],
      ['Networking Solutions', 'Enterprise-grade networking setup for offices, including WiFi, LAN, and server configuration.', '2026-11-01', 'IT Services'],
      ['Software Development', 'Custom software and web development services for local businesses in Jamui.', '2027-01-15', 'Software']
    ];
    for (const [title, desc, date, cat] of items) {
      await conn.query(
        'INSERT INTO coming_soon (title, description, launch_date, category, status) VALUES (?, ?, ?, ?, 1)',
        [title, desc, date, cat]
      );
    }
    console.log('   ✓ Coming Soon items (3)');
  }

  await conn.end();
  console.log('\n✅ Database seeding completed successfully!');
  console.log('   Admin Login: admin@storefly.in / StoreF1y@2026');
  console.log('   Database: ' + DB_NAME);
  process.exit(0);
}

seed().catch((error) => {
  console.error('\n❌ Seeding failed:', error.message);
  console.error('\nMake sure MySQL is running and accessible with the configured credentials.');
  process.exit(1);
});
