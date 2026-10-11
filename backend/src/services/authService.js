import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export async function login(email, password) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid email or password');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Invalid email or password');
  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  delete safeUser.password;
  return { token, user: safeUser };
}

export async function createUser(data) {
  const exists = await User.exists({ email: data.email.toLowerCase() });
  if (exists) throw new ApiError(409, 'A user with this email already exists');
  const { password, ...userData } = data;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ ...userData, email: data.email.toLowerCase(), passwordHash });
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  delete safeUser.password;
  return safeUser;
}

