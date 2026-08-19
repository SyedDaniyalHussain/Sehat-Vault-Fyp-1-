import {Router} from 'express'; import {requireAuth} from '../middleware/auth.js'; import {createShare,listShares,revokeShare,inspectShare,authenticateShare,sharedReports,sharedFile} from '../controllers/shareController.js';
const r=Router();
r.post('/',requireAuth,createShare); r.get('/',requireAuth,listShares); r.delete('/:id',requireAuth,revokeShare);
r.get('/public/:token',inspectShare); r.post('/public/:token/authenticate',authenticateShare); r.get('/public/:token/reports',sharedReports); r.get('/public/:token/reports/:reportId/file',sharedFile);
export default r;
