import jwt from 'jsonwebtoken';
import * as User from '../models/User.js';

export async function requireAuth(req,res,next) {
  try {
    const token = req.cookies?.access_token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7) : null);
    if(!token) return res.status(401).json({error:'Authentication required.'});
    const payload = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if(!user) return res.status(401).json({error:'Invalid session.'});
    req.user = user;
    next();
  } catch {
    return res.status(401).json({error:'Invalid or expired session.'});
  }
}
