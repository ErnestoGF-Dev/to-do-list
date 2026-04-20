import { UUID } from "crypto";

export interface Task {
    id: UUID;
    title: string;
    description: string;
    status: string;
}

export interface TaskUpdate {
    title: string;
    description: string;
    status: string;
}