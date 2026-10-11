import { Router } from 'express';
import * as institution from '../controllers/institutionController.js';
import * as content from '../controllers/contentController.js';
import * as contact from '../controllers/contactController.js';
import * as account from '../controllers/accountController.js';
import { requireAuth, allowRoles } from '../middlewares/auth.js';
import { ROLES } from '../constants/roles.js';
import {
  accountSchema,
  institutionCreateSchema,
  institutionUpdateSchema,
  newsSchema,
  eventSchema,
  gallerySchema,
  settingSchema
} from '../validators/schemas.js';
import { validate } from '../middlewares/validate.js';
import { parseImageUpload } from '../middlewares/imageUpload.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = Router();
router.use(requireAuth);
router.post('/uploads/images', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL), parseImageUpload, uploadImage);
router.get('/institutions', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL), institution.adminList);
router.post('/institutions', allowRoles(ROLES.TRUST_ADMIN), validate(institutionCreateSchema), institution.create);
router.patch('/institutions/:id', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL), validate(institutionUpdateSchema), institution.update);
router.get('/news', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER), content.adminNews);
router.post('/news', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL), validate(newsSchema), content.createNews);
router.delete('/news/:id', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL), content.deleteNews);
router.get('/events', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER), content.adminEvents);
router.post('/events', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL), validate(eventSchema), content.createEvent);
router.delete('/events/:id', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL), content.deleteEvent);
router.get('/gallery', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER), content.adminGallery);
router.post('/gallery', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL), validate(gallerySchema), content.createGallery);
router.delete('/gallery/:id', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL), content.deleteGallery);
router.put('/settings/:key', allowRoles(ROLES.TRUST_ADMIN), validate(settingSchema), content.setting);
router.get('/contact-messages', allowRoles(ROLES.TRUST_ADMIN), contact.list);
router.get('/accounts', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.PRINCIPAL, ROLES.ACCOUNTANT), account.list);
router.post('/accounts', allowRoles(ROLES.TRUST_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.ACCOUNTANT), validate(accountSchema), account.create);
export default router;



