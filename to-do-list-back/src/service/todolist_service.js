import { saveUser, validateUser, createTask, getAllTasks, updateTask, deleteTask } from '../repository/pgsql';
import AppError from '../utils/appError';



function CreateUser(user) {
    return saveUser(user);
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
    console.log("task_id:", task_id);
    
    console.log("user_id:", user_id);
    if (!validateUser(user_id)) {
        throw new AppError('Usuario no válido', 400);
    }

    return updateTask(task_id, task, user_id);
}

function DeleteTask(id, userID, userEmail) {
    console.log("id:", id);
    console.log("userID:", userID);
    console.log("userEmail:", userEmail);
    if (!validateUser(userID)) {
        throw new AppError('Usuario no válido', 400);
    }
    return deleteTask(id, userID, userEmail);
}

export default {
    CreateUser,
    CreateTask,
    GetAllTasks,
    UpdateTask,
    DeleteTask
}