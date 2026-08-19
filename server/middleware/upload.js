import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {v4 as uuidv4} from 'uuid';
const dir=process.env.UPLOAD_DIR || 'uploads';
fs.mkdirSync(dir,{recursive:true});
const allowed=new Map([['application/pdf','.pdf'],['image/jpeg','.jpg'],['image/png','.png'],['image/webp','.webp']]);
const storage=multer.diskStorage({destination:dir,filename:(req,file,cb)=>cb(null,`${uuidv4().replaceAll('-','')}${path.extname(file.originalname).toLowerCase()}`)});
export const upload=multer({storage,limits:{fileSize:(Number(process.env.MAX_FILE_SIZE_MB)||16)*1024*1024},fileFilter:(req,file,cb)=>allowed.has(file.mimetype)?cb(null,true):cb(new Error('Only PDF, JPG, PNG, and WEBP files are allowed.'))});
export function mimeToType(mime){return allowed.get(mime)?.slice(1) || 'file';}
