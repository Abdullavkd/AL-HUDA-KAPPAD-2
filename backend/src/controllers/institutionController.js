import * as service from '../services/institutionService.js';

export async function publicList(req, res) {
  res.json({
    success: true,
    data: await service.listPublicInstitutions()
  });
}

export async function publicGet(req, res) {
  res.json({
    success: true,
    data: await service.getPublicInstitution(req.params.slug)
  });
}

export async function adminList(req, res) {
  res.json({
    success: true,
    data: await service.listInstitutions(req.user)
  });
}

export async function create(req, res) {
  res.status(201).json({
    success: true,
    data: await service.createInstitution(req.validated.body)
  });
}

export async function update(req, res) {
  res.json({
    success: true,
    data: await service.updateInstitution(req.params.id, req.validated.body, req.user)
  });
}
