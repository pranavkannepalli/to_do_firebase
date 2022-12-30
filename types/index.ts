export interface ITodo {
    id: number;
    description: string;
    isDone: boolean;
    addedBy: string;
}

export interface GroupRequest {
    id: string;
    email: string;
}