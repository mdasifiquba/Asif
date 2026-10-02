import { Router } from 'express';
import { getHero } from '../controllers/heroController';
import { getAnnouncements } from '../controllers/announcementController';
import { getStatistics } from '../controllers/statisticsController';
import { getServices, getServiceBySlug, getCategories } from '../controllers/serviceController';
import { createBooking } from '../controllers/bookingController';
import { getFeatures } from '../controllers/featureController';
import { getHowItWorks } from '../controllers/howItWorksController';
import { getFounder } from '../controllers/founderController';
import { getTestimonials } from '../controllers/testimonialController';
import { submitContact } from '../controllers/contactController';
import { getComingSoon } from '../controllers/comingSoonController';
import { getSettings } from '../controllers/settingsController';
import { bookingLimiter } from '../middleware/rateLimit';

const router = Router();

// Hero
router.get('/hero', getHero);

// Announcements
router.get('/announcements', getAnnouncements);

// Statistics
router.get('/statistics', getStatistics);

// Categories
router.get('/categories', getCategories);

// Services
router.get('/services', getServices);
router.get('/services/:slug', getServiceBySlug);

// Bookings (public submission)
router.post('/bookings', bookingLimiter, createBooking);

// Features (Why Choose Us)
router.get('/features', getFeatures);

// How It Works
router.get('/how-it-works', getHowItWorks);

// Founder
router.get('/founder', getFounder);

// Testimonials
router.get('/testimonials', getTestimonials);

// Contact
router.post('/contact', submitContact);

// Coming Soon
router.get('/coming-soon', getComingSoon);

// Settings
router.get('/settings', getSettings);

export default router;
