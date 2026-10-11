import * as service from '../services/contentService.js';
import { News } from '../models/News.js';
import { Event } from '../models/Event.js';
import { Gallery } from '../models/Gallery.js';

export async function home(req, res) {
  res.json({ success: true, data: await service.getHomeContent() });
}

export async function news(req, res) {
  res.json({ success: true, data: await service.listNews() });
}

export async function events(req, res) {
  res.json({ success: true, data: await service.listEvents() });
}

export async function gallery(req, res) {
  res.json({ success: true, data: await service.listGallery() });
}

export async function adminNews(req, res) {
  res.json({ success: true, data: await service.listAdminNews(req.user) });
}

export async function adminEvents(req, res) {
  res.json({ success: true, data: await service.listAdminEvents(req.user) });
}

export async function adminGallery(req, res) {
  res.json({ success: true, data: await service.listAdminGallery(req.user) });
}

export async function createNews(req, res) {
  res.status(201).json({
    success: true,
    data: await service.createNews(req.validated.body, req.user)
  });
}

export async function createEvent(req, res) {
  res.status(201).json({
    success: true,
    data: await service.createEvent(req.validated.body, req.user)
  });
}

export async function createGallery(req, res) {
  res.status(201).json({
    success: true,
    data: await service.createGallery(req.validated.body, req.user)
  });
}

export async function setting(req, res) {
  res.json({
    success: true,
    data: await service.upsertSetting(req.params.key, req.validated.body.value)
  });
}

export async function deleteNews(req, res) {
  res.json({
    success: true,
    data: await service.deleteById(News, req.params.id, req.user)
  });
}

export async function deleteEvent(req, res) {
  res.json({
    success: true,
    data: await service.deleteById(Event, req.params.id, req.user)
  });
}

export async function deleteGallery(req, res) {
  res.json({
    success: true,
    data: await service.deleteById(Gallery, req.params.id, req.user)
  });
}
