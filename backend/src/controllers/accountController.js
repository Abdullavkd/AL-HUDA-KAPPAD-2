import * as service from '../services/accountService.js';

export async function list(req, res) {
  res.json({
    success: true,
    data: await service.listAccounts(req.query.institutionId, req.user)
  });
}

export async function create(req, res) {
  res.status(201).json({
    success: true,
    data: await service.createAccount(req.validated.body, req.user)
  });
}

