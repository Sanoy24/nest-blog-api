import * as crypto from 'node:crypto';
export const verificationToken = crypto.randomBytes(32).toString('hex');
