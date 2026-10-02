import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { getProfile, changePassword } from '../controllers/authController';
import { updateHero } from '../controllers/heroController';
import { getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController';
import { getAllStatistics, createStatistic, updateStatistic, deleteStatistic } from '../controllers/statisticsController';
import { getAllServices, createService, updateService, deleteService, getCategories, createCategory } from '../controllers/serviceController';
import { getBookings, getBookingById, updateBooking, deleteBooking, getBookingStats } from '../controllers/bookingController';
import { getAllFeatures, createFeature, updateFeature, deleteFeature } from '../controllers/featureController';
import { getAllHowItWorks, createStep, updateStep, deleteStep } from '../controllers/howItWorksController';
import { updateFounder } from '../controllers/founderController';
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import { getMessages, getMessageById, updateMessage, deleteMessage } from '../controllers/contactController';
import { getAllComingSoon, createComingSoon, updateComingSoon, deleteComingSoon } from '../controllers/comingSoonController';
import { uploadMedia, getMedia, deleteMedia } from '../controllers/mediaController';
import { updateSettings, updateSocialLinks, getSeoPages, updateSeoPage, getDashboardStats } from '../controllers/settingsController';

const router = Router();

// All admin routes require authentication
router.use(authMiddleware);

// Profile
router.get('/profile', getProfile);
router.put('/change-password', changePassword);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Hero
router.put('/hero', updateHero);

// Announcements
router.get('/announcements', getAllAnnouncements);
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

// Statistics
router.get('/statistics', getAllStatistics);
router.post('/statistics', createStatistic);
router.put('/statistics/:id', updateStatistic);
router.delete('/statistics/:id', deleteStatistic);

// Services
router.get('/services', getAllServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);

// Bookings
router.get('/bookings', getBookings);
router.get('/bookings/stats', getBookingStats);
router.get('/bookings/:id', getBookingById);
router.put('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking);

// Features
router.get('/features', getAllFeatures);
router.post('/features', createFeature);
router.put('/features/:id', updateFeature);
router.delete('/features/:id', deleteFeature);

// How It Works
router.get('/how-it-works', getAllHowItWorks);
router.post('/how-it-works', createStep);
router.put('/how-it-works/:id', updateStep);
router.delete('/how-it-works/:id', deleteStep);

// Founder
router.put('/founder', updateFounder);

// Testimonials
router.get('/testimonials', getAllTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Messages
router.get('/messages', getMessages);
router.get('/messages/:id', getMessageById);
router.put('/messages/:id', updateMessage);
router.delete('/messages/:id', deleteMessage);

// Coming Soon
router.get('/coming-soon', getAllComingSoon);
router.post('/coming-soon', createComingSoon);
router.put('/coming-soon/:id', updateComingSoon);
router.delete('/coming-soon/:id', deleteComingSoon);

// Media
router.post('/media/upload', upload.single('file'), uploadMedia);
router.get('/media', getMedia);
router.delete('/media/:id', deleteMedia);

// Settings
router.put('/settings', updateSettings);
router.put('/social-links', updateSocialLinks);
router.get('/seo', getSeoPages);
router.put('/seo', updateSeoPage);

export default router;
