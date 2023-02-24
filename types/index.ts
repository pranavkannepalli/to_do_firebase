export interface ITodo {
    id: number;
    description: string;
    isDone: boolean;
    addedBy: string;
    date?: Date | null;
    subtasks?: ITodo[];
}

export interface GroupRequest {
    id: string;
    username: string;
}