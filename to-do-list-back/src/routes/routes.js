import { Router } from 'express';
const router = Router();
import { body, validationResult, query } from 'express-validator';


import { CreateUser,ValidateUser, CreateTask, GetAllTasks, UpdateTask, DeleteTask } from '../service/todolist_service.js';

router.post('/createUser', [body('email').isEmail().normalizeEmail().withMessage('Debe de ser un correo electrónico válido')], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errors);
    }

    try {
        const user = req.body;
        const result = await CreateUser(user);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/validateUser', [body('email').isEmail().normalizeEmail().withMessage('Debe de ser un correo electrónico válido')], async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errors);
    }
    try {
        const email = req.body.email;
        const result = await ValidateUser(email);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/createTask', [body('title').notEmpty().withMessage('El título es requerido'), body('description').notEmpty().withMessage('La descripción es requerida'), body('status').notEmpty().withMessage('El estado es requerido')], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errors);
    }

    try {
        const task = req.body;
        const user_id = req.headers['user_id'];
        const result = await CreateTask(task, user_id);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/tasks', [query('email').isEmail().normalizeEmail().withMessage('Debe de ser un correo electrónico válido')], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errors);;
    }

    try {
        const email = req.query.email;
        const result = await GetAllTasks(email);
        res.status(200).json(result);
    } catch (error) {
       next(error);
    }
});

router.put('/updateTask', [query('id').notEmpty().withMessage('El ID de la tarea es requerido'), body('title').notEmpty().withMessage('El título es requerido'), body('description').notEmpty().withMessage('La descripción es requerida'), body('status').notEmpty().withMessage('El estado es requerido')], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errors);
    }

    try {
        const task_id = req.query.id;
        const task = req.body;
        const user_id = req.headers['user_id'];
        const result = await UpdateTask(task_id, task, user_id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.delete('/deleteTask', [query('id').notEmpty().withMessage('El ID de la tarea es requerido')], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errors);
    }

    try {
        const id = req.query.id;
        const userID = req.headers['user_id'];
        const userEmail = req.headers['user_email'];
        const result = await DeleteTask(id, userID, userEmail);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export default router;