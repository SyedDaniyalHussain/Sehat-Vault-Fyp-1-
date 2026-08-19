import 'dotenv/config'; import app from './app.js'; import {connectDB} from './config/db.js';
const port=process.env.PORT||5001; await connectDB(); app.listen(port,()=>console.log(`Sehat Vault server running at http://localhost:${port}`));
