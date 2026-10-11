import { login, createUser } from '../services/authService.js';
export async function loginController(req, res) { res.json({ success: true, data: await login(req.body.email, req.body.password) }); }
export async function meController(req, res) { res.json({ success: true, data: req.user }); }
export async function createUserController(req, res) { res.status(201).json({ success: true, data: await createUser(req.validated.body) }); }

