import * as service from '../services/contactService.js';
export async function create(req, res) { res.status(201).json({ success: true, message: 'Thank you. Your message has been received.', data: await service.createContactMessage(req.validated.body) }); }
export async function list(req, res) { res.json({ success: true, data: await service.listContactMessages() }); }

