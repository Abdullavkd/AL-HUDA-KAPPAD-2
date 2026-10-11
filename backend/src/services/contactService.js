import { ContactMessage } from '../models/ContactMessage.js';
export async function createContactMessage(data) { return ContactMessage.create(data); }
export async function listContactMessages() { return ContactMessage.find().sort({ createdAt: -1 }); }
