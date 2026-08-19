// import express from 'express'; import cors from 'cors'; import cookieParser from 'cookie-parser'; import helmet from 'helmet'; import path from 'path';
// import authRoutes from './routes/auth.js'; import reportRoutes from './routes/reports.js'; import shareRoutes from './routes/shares.js';
// const app=express(); app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}})); app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173',credentials:true})); app.use(express.json({limit:'2mb'})); app.use(cookieParser());
// app.get('/api',(_,res)=>res.json({name:'Sehat Vault API',version:'2.0.0 MERN',status:'healthy'})); app.use('/api/auth',authRoutes); app.use('/api/reports',reportRoutes); app.use('/api/shares',shareRoutes);
// app.use((err,req,res,next)=>{console.error(err); if(err.code==='LIMIT_FILE_SIZE')return res.status(400).json({error:'File exceeds the 16MB limit.'}); res.status(500).json({error:err.message||'Internal server error.'});});
// export default app;



import express from 'express'; 
import cors from 'cors'; 
import cookieParser from 'cookie-parser'; 
import helmet from 'helmet'; 
import path from 'path';

import authRoutes from './routes/auth.js'; 
import reportRoutes from './routes/reports.js'; 
import shareRoutes from './routes/shares.js';

const app = express(); 

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); 

// Allowed origins for CORS
const allowedOrigins = [
  'https://sehat-vault-fyp-1.vercel.app',
  'http://localhost:5173',
  'http://localhost:5001'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '2mb' })); 
app.use(cookieParser());

app.get('/api', (_, res) => res.json({ name: 'Sehat Vault API', version: '2.0.0 MERN', status: 'healthy' })); 
app.use('/api/auth', authRoutes); 
app.use('/api/reports', reportRoutes); 
app.use('/api/shares', shareRoutes);

app.use((err, req, res, next) => {
  console.error(err); 
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File exceeds the 16MB limit.' }); 
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

export default app;