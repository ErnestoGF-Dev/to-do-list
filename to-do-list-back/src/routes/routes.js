import { Router } from 'express';
const router = Router();
import { body, validationResult, query } from 'express-validator';


import { CreateUser, CreateTask, GetAllTasks, UpdateTask, DeleteTask } from '../service/todolist_service';

router.post('/createUser', [body('email').isEmail().normalizeEmail().withMessage('Debe de ser un correo electrónico válido')], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = req.body;
        const result = await CreateUser(user);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/createTask', [body('title').notEmpty().withMessage('El título es requerido'), body('description').notEmpty().withMessage('La descripción es requerida'), body('status').notEmpty().withMessage('El estado es requerido')], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const task = req.body;
        const user_id = req.headers['user_id'];
        const result = await CreateTask(task, user_id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/tasks', [query('email').isEmail().normalizeEmail().withMessage('Debe de ser un correo electrónico válido')], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.query.email;
        const result = await GetAllTasks(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/updateTask', [query('id').notEmpty().withMessage('El ID de la tarea es requerido'), body('title').notEmpty().withMessage('El título es requerido'), body('description').notEmpty().withMessage('La descripción es requerida'), body('status').notEmpty().withMessage('El estado es requerido')], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const task_id = req.query.id;
        const task = req.body;
        const user_id = req.headers['user_id'];
        const result = await UpdateTask(task_id, task, user_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/deleteTask', [query('id').notEmpty().withMessage('El ID de la tarea es requerido')], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const id = req.query.id;
        const userID = req.headers['user_id'];
        const userEmail = req.headers['user_email'];
        const result = await DeleteTask(id, userID, userEmail);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;