import db from '../config/db';
import { User, Task, TaskUpdate } from '../models/todolist';
import AppError from '../utils/appError';

export
    /**
     * Se guarda un nuevo usuario en la base de datos, esto es necesario para controlar que cada usuario solo vea sus tareas
     * @param {User} user - Objeto con los datos del usuario a guardar
     * @returns {Promise<Object>} Objeto del usuario guardado
     */
    async function saveUser(user) {
    try {
        const result = await db.query('INSERT INTO users (email) VALUES ($1) RETURNING *', [user.email]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al guardar el usuario: ' + error.message);
    }
}
export
    /**
     * Obtiene todas las tareas de un usuario mediente su correo, para controlar que cada usuario solo vea sus tareas
     * y las vea en distintos dispositivos
     * @param {string} email - Email del usuario
     * @returns {Promise<Array>} Array de tareas
     */
    async function getAllTasks(email) {
    try {
        const result = await db.query('SELECT title, description, status FROM tasks WHERE user_id = (SELECT id FROM users WHERE email = $1) ORDER BY id ASC', [email]);

        if (result.rows.length === 0) {
            throw new AppError('No se encontraron tareas para el usuario con email: ' + email, 404);
        }

        return result.rows;
    } catch (error) {
        throw new Error('Error al obtener las tareas: ' + error.message);
    }
}
export
    /**
     * Valida que el usuario exista en la base de datos
     * @param {UUID} user_id - ID del usuario a validar
     * @returns {Promise<boolean>} true si el usuario existe, false si no existe
     */
    async function validateUser(user_id) {
    try {
        const result = await db.query('SELECT EXISTS (SELECT 1 FROM users WHERE id = $1) AS exists', [user_id]);
        return result.rows[0].exists;
    } catch (error) {
        throw new Error('Error al validar el usuario: ' + error.message);
    }
}
export
    /**
     * Crea una nueva tarea
     * @param {Task} task - Objeto con los datos de la tarea (title, description, status)
     * @param {UUID} user_id - ID del usuario que crea la tarea
     * @returns {Promise<Object>} Objeto de la tarea creada
     */
    async function createTask(task, user_id) {
    try {
        const result = await db.query(
            'INSERT INTO tasks (user_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING title, description, status; ',
            [user_id, task.title, task.description, task.status]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al crear la tarea: ' + error.message);
    }
}
export
    /**
     * Actualiza una tarea existente
     * @param {number} task_id - ID de la tarea a actualizar
     * @param {TaskUpdate} task - Objeto con los datos actualizados de la tarea
     * @param {UUID} user_id - ID del usuario que intenta actualizar la tarea
     * @returns {Promise<Object>} Objeto de la tarea actualizada
     */
    async function updateTask(task_id, task, user_id) {
    try {
        const result = await db.query('UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING title, description, status', [task.title, task.description, task.status, task_id, user_id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al actualizar la tarea: ' + error.message);
    }
}
export
    /**
     * Elimina una tarea
     * @param {number} id - ID de la tarea a eliminar
     * - Credenciales del usuario para verificar que solo pueda eliminar sus tareas
     * @param {number} userID - ID del usuario que intenta eliminar la tarea
     * @returns {Promise<void>}
     */
    async function deleteTask(id, userID) {
    try {

        await db.query('DELETE FROM tasks USING users WHERE tasks.id = $1 AND tasks.user_id = users.id AND users.id = $2 ', [id, userID]);

    } catch (error) {
        throw new Error('Error al eliminar la tarea: ' + error.message);
    }
}