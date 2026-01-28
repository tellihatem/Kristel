import crypto from 'crypto';

export function validateTelegramAuth(data: any, botToken: string) {
  const { hash, ...userData } = data;
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  
  const dataCheckString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join('\n');

  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return hmac === hash;
}
