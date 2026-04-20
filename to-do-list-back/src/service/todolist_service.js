import { saveUser, validateUser, createTask, getAllTasks, updateTask, deleteTask, getUserAndValidate } from '../repository/pgsql.js';
import AppError from '../utils/appError.js';



function CreateUser(user) {
    return saveUser(user);
}

function ValidateUser(email) {
    return getUserAndValidate(email);
}

function CreateTask(task, user_id) {
    if (!validateUser(user_id)) {
        throw new AppError('Usuario no válido', 400);
    }

    return createTask(task, user_id);
}   

function GetAllTasks(email) {
    return getAllTasks(email);
}

function UpdateTask(task_id, task, user_id) {
    console.log("task_service:", task);
    if (!validateUser(user_id)) {
        throw new AppError('Usuario no válido', 400);
    }

    return updateTask(task_id, task, user_id);
}

function DeleteTask(id, userID, userEmail) {
    if (!validateUser(userID)) {
        throw new AppError('Usuario no válido', 400);
    }
    return deleteTask(id, userID, userEmail);
}

export {
    CreateUser,
    ValidateUser,
    CreateTask,
    GetAllTasks,
    UpdateTask,
    DeleteTask
};