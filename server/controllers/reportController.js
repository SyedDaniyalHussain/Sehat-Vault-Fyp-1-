import fs from 'fs/promises';
import path from 'path';
import * as Report from '../models/Report.js';
import {mimeToType} from '../middleware/upload.js';

function dto(r) {
  return {
    id:r.id, originalFilename:r.originalFilename, storedFilename:r.storedFilename,
    fileType:r.fileType, mimeType:r.mimeType, fileSize:r.fileSize,
    reportType:r.reportType, uploadedAt:r.uploadedAt
  };
}

export async function uploadReport(req,res) {
  if(!req.file) return res.status(400).json({error:'No file selected.'});
  const r = await Report.create({
    userId:req.user.id,
    originalFilename:req.file.originalname,
    storedFilename:req.file.filename,
    filePath:req.file.path,
    fileType:mimeToType(req.file.mimetype),
    mimeType:req.file.mimetype,
    fileSize:req.file.size,
    reportType:req.body.report_type?.trim() || null
  });
  res.status(201).json({message:'Original medical document uploaded successfully.',report:dto(r)});
}

export async function listReports(req,res) {
  const rows = await Report.findByUser(req.user.id);
  res.json({reports:rows.map(dto)});
}

export async function getReport(req,res) {
  const r = await Report.findById(req.params.id,req.user.id);
  if(!r) return res.status(404).json({error:'Report not found.'});
  res.json({report:dto(r)});
}

export async function viewOwnedFile(req,res) {
  const r = await Report.findById(req.params.id,req.user.id);
  if(!r) return res.status(404).json({error:'Report not found.'});
  res.setHeader('Content-Type',r.mimeType);
  res.setHeader('Content-Disposition',`inline; filename="${r.originalFilename.replaceAll('"','')}"`);
  res.sendFile(path.resolve(r.filePath));
}

export async function deleteReport(req,res) {
  const r = await Report.findById(req.params.id,req.user.id);
  if(!r) return res.status(404).json({error:'Report not found.'});
  await fs.rm(r.filePath,{force:true});
  await Report.remove(req.params.id,req.user.id);
  res.json({message:'Report deleted successfully.'});
}
