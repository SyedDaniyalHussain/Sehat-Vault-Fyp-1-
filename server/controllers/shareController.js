import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import * as Share from '../models/Share.js';
import * as Report from '../models/Report.js';
import path from 'path';

const hash = s => crypto.createHash('sha256').update(s).digest('hex');

function accessToken(share) {
  return jwt.sign({shareId:String(share.id)},process.env.SHARE_JWT_SECRET,{expiresIn:'15m'});
}

async function getShare(req) {
  return Share.findByTokenHash(hash(req.params.token));
}

export async function createShare(req,res) {
  try {
    const {reportIds,expiresAt,pin} = req.body;
    if(!Array.isArray(reportIds)||reportIds.length<1||!expiresAt||!/^\d{6}$/.test(String(pin)))
      return res.status(400).json({error:'Select at least one report, expiry, and a 6-digit access PIN.'});

    const normalizedIds = [...new Set(reportIds.map(Number))];
    const expiry = new Date(expiresAt);
    if(Number.isNaN(expiry.getTime())||expiry<=new Date())
      return res.status(400).json({error:'Expiry must be in the future.'});

    const reports = await Report.findManyOwned(normalizedIds,req.user.id);
    if(reports.length!==normalizedIds.length)
      return res.status(403).json({error:'One or more reports do not belong to you.'});

    const raw = crypto.randomBytes(32).toString('base64url');
    const share = await Share.create({
      ownerId:req.user.id, reportIds:normalizedIds,
      tokenHash:hash(raw), pinHash:await bcrypt.hash(String(pin),12), expiresAt:expiry
    });

    const url = `${process.env.CLIENT_URL}/shared/${raw}`;
    const qr = await QRCode.toDataURL(url,{width:320,margin:2});

    res.status(201).json({
      share:{id:share.id,expiresAt:share.expiresAt,reportCount:normalizedIds.length,qrCode:qr,shareUrl:url}
    });
  } catch(e) {
    res.status(500).json({error:'Failed to create share.',details:e.message});
  }
}

export async function listShares(req,res) {
  const rows = await Share.findByOwner(req.user.id);
  res.json({shares:rows.map(s=>({
    id:s.id, expiresAt:s.expiresAt, revokedAt:s.revokedAt,
    reportCount:s.reportCount, active:!s.revokedAt && new Date(s.expiresAt)>new Date()
  }))});
}

export async function revokeShare(req,res) {
  const ok = await Share.revoke(req.params.id,req.user.id);
  if(!ok) return res.status(404).json({error:'Share not found.'});
  res.json({message:'Share revoked.'});
}

export async function inspectShare(req,res) {
  const s = await getShare(req);
  if(!s||s.revokedAt||new Date(s.expiresAt)<=new Date())
    return res.status(404).json({error:'This share is expired or revoked.'});
  res.json({valid:true,expiresAt:s.expiresAt,reportCount:s.reportIds.length});
}

export async function authenticateShare(req,res) {
  const s = await getShare(req);
  if(!s||s.revokedAt||new Date(s.expiresAt)<=new Date())
    return res.status(404).json({error:'This share is expired or revoked.'});
  if(!(await bcrypt.compare(String(req.body.pin||''),s.pinHash)))
    return res.status(401).json({error:'Invalid access PIN.'});
  res.json({accessToken:accessToken(s),expiresAt:s.expiresAt});
}

function sharedDto(r) {
  return {
    id:r.id,originalFilename:r.originalFilename,fileType:r.fileType,
    mimeType:r.mimeType,fileSize:r.fileSize,reportType:r.reportType,uploadedAt:r.uploadedAt
  };
}

export async function sharedReports(req,res) {
  try {
    const p = jwt.verify(
      req.headers.authorization?.replace('Bearer ','')||'',
      process.env.SHARE_JWT_SECRET
    );
    const s = await Share.findById(p.shareId);
    if(!s||s.revokedAt||new Date(s.expiresAt)<=new Date())
      return res.status(403).json({error:'Share is no longer available.'});
    const reports = await Share.findReportsForShare(s.id);
    res.json({reports:reports.map(sharedDto)});
  } catch {
    res.status(401).json({error:'Invalid share access.'});
  }
}

export async function sharedFile(req,res) {
  try {
    const p = jwt.verify(
      req.headers.authorization?.replace('Bearer ','')||'',
      process.env.SHARE_JWT_SECRET
    );
    const s = await Share.findById(p.shareId);
    if(!s||s.revokedAt||new Date(s.expiresAt)<=new Date()||
       !(await Share.shareContainsReport(s.id,Number(req.params.reportId))))
      return res.status(403).json({error:'Report is not available through this share.'});

    const r = await Report.findById(req.params.reportId);
    if(!r) return res.status(404).json({error:'Report not found.'});
    res.setHeader('Content-Type',r.mimeType);
    res.setHeader('Content-Disposition',`inline; filename="${r.originalFilename.replaceAll('"','')}"`);
    res.setHeader('Cache-Control','no-store');
    res.sendFile(path.resolve(r.filePath));
  } catch {
    res.status(401).json({error:'Invalid share access.'});
  }
}
