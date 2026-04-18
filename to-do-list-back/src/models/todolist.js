import e from "express";

export class User {
    constructor(email) {
        this.email = email;
    }
}

export class Task {
    constructor(title, description, status) {
        this.title = title;
        this.description = description;
        this.status = status;
    }
}

export class TaskUpdate {
    constructor(id, title, description, status, userID) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.userID = userID;    
    }
}
