import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getFormData, saveFormData } from '../controller/formController.js';

const formRouter = express.Router();

formRouter.post('/save',userAuth,  saveFormData);
formRouter.get('/get', userAuth, getFormData);

export default formRouter;
