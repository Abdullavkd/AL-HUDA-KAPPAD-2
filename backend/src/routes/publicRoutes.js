import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as content from '../controllers/contentController.js';
import * as institution from '../controllers/institutionController.js';
import * as contact from '../controllers/contactController.js';
import { validate } from '../middlewares/validate.js';
import { contactSchema } from '../validators/schemas.js';
const router = Router();
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many contact submissions. Please try again later.' }
});
router.get('/home', content.home);
router.get('/institutions', institution.publicList);
router.get('/institutions/:slug', institution.publicGet);
router.get('/news', content.news);
router.get('/events', content.events);
router.get('/gallery', content.gallery);
router.post('/contact', contactRateLimit, validate(contactSchema), contact.create);
export default router;
