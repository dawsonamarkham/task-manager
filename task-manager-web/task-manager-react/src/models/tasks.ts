// Used to assist selectors
export const ValidCategories = ['Work', 'Personal', 'Hobby', 'Other'];

// Defines expected data for/from task endpoints
export type Categories = 'Work'|'Personal'|'Hobby'|'Other';

export interface TaskBody {
    title: string,
    description?: string,
    category: Categories,
    completed: boolean
}

export interface TaskData {
    id: string,
    createdAt: string,
    updatedAt: string,
    userId: string,
    title: string,
    description: string,
    category: Categories,
    completed: boolean
}

export interface PaginatedTaskData {
    data: Array<TaskData>,
    page: number,
    limit: number,
    total: number
}

export interface TaskQuery {
    page: number,
    limit: number,
    categoryFilter?: Categories,
    completionFilter?: boolean 
}