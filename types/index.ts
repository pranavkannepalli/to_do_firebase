export interface ITodo {
    id: number;
    description: string;
    isDone: boolean;
    addedBy: string;
    date?: Date | null;
}

export interface GroupRequest {
    id: string;
    email: string;
}