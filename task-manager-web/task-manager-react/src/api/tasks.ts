import axios from 'axios'
import { PaginatedTaskData, TaskBody, TaskData, TaskQuery } from '../models/tasks';

// Define request/callback mechanisms for task endpoints
export async function getTasks(
    queries: TaskQuery,
    callback: (pagedTasks?: PaginatedTaskData, err?: any) => void
): Promise<void> {
    try {
        // Construct query from object
        let qry = Object.entries(queries).reduce((acc, [key, val]) => {
            acc += val !== undefined ? '&' + key + '=' + val : '';
            return acc;
        }, '');
        qry = qry ? '?' + qry.slice(1) : qry;
        const res = await axios.get('/rest/tasks'+qry, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('tmAccessToken'),
                'Content-Type': 'application/json'
            }
        });
        callback(res.data as PaginatedTaskData, undefined);
    } catch (err) {
        callback(undefined, err);
    }
}

export async function getTaskById(
    id: string,
    callback: (task?: TaskData, err?: any) => void
): Promise<void> {
    try {
        const res = await axios.get('/rest/tasks/'+id, {
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

export async function createTask(
    data: TaskBody,
    callback: (task?: TaskData, err?: any) => void
): Promise<void> {
    try {
        const res = await axios.post('/rest/tasks', data, {
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

export async function updateTaskById(
    id: string,
    data: TaskBody,
    callback: (task?: TaskData, err?: any) => void
): Promise<void> {
    try {
        const res = await axios.put('/rest/tasks/'+id, data, {
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

export async function deleteTaskById(
    id: string,
    callback: (completed: boolean, err?: any) => void
): Promise<void> {
    try {
        await axios.delete('/rest/tasks/'+id, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('tmAccessToken'),
                'Content-Type': 'application/json'
            }
        });
        callback(true, undefined);
    } catch (err) {
        callback(false, err);
    }
}