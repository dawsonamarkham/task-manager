import axios from "axios"

export type Categories = "Work"|"Personal"|"Hobby"|"Other";
export const ValidCategories: Array<Categories> = ['Work', 'Personal', 'Hobby', 'Other'];

export interface TaskData {
    id: string,
    createdAt: number,
    updatedAt: number,
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

export async function getTaskById(
    id: string,
    callback: (task?: TaskData, err?: any) => void
): Promise<void> {
    try {
        const res = await axios.get('/tasks/'+id, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('tmAccessToken'),
                'Content-Type': 'application/json'
            }
        });
        callback(res.data as TaskData, undefined);
    } catch (err) {
        callback(undefined, err);
    }
}