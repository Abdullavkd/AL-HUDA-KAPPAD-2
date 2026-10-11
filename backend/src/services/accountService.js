import { Account } from '../models/Account.js';
import { ROLES } from '../constants/roles.js';
import { ApiError } from '../utils/apiError.js';

function assignedIds(user) {
  return (user.institutionIds || []).map(id => String(id));
}

function ensureAssigned(user, institutionId) {
  if (user.role === ROLES.TRUST_ADMIN) return;

  if (!institutionId || !assignedIds(user).includes(String(institutionId))) {
    throw new ApiError(403, 'You do not have access to this institution');
  }
}

export async function listAccounts(institutionId, user) {
  if (user.role === ROLES.TRUST_ADMIN) {
    return Account.find(institutionId ? { institutionId } : {})
      .populate('institutionId', 'name slug')
      .sort({ name: 1 });
  }

  if (institutionId) {
    ensureAssigned(user, institutionId);
  }

  const filter = institutionId
    ? { institutionId }
    : { institutionId: { $in: assignedIds(user) } };

  return Account.find(filter)
    .populate('institutionId', 'name slug')
    .sort({ name: 1 });
}

export async function createAccount(data, user) {
  ensureAssigned(user, data.institutionId);

  const accountData = {
    institutionId: data.institutionId,
    name: data.name,
    type: data.type,
    bankName: data.bankName || '',
    accountName: data.accountName || '',
    accountNumberMasked: data.accountNumberMasked || '',
    upiId: data.upiId || ''
  };

  return Account.create(accountData);
}


