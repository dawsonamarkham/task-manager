import axios from 'axios'
import { AuthBody } from '../models/auth';

// Define request/callbacks for auth endpoints
export async function createAcount(data: AuthBody, callback: (tkn?: string, err?: any) => void): Promise<void> {
    try {
        const res = await axios.post('/auth/signup', data,  {
            headers: {
                'Content-Type': 'application/json'
        }});
        callback(res.data['access_token'], undefined);
    } catch (err) {
        callback(undefined, err);
    } 
}

export async function createToken(data: AuthBody, callback: (tkn?: string, err?: any) => void): Promise<void> {
    try {
        const res = await axios.post('/auth/signin', data,  {
            headers: {
                'Content-Type': 'application/json'
        }});
        callback(res.data['access_token'], undefined);
    } catch (err) {
        callback(undefined, err);
    } 
}

export async function destroyToken(data: {}, callback: (success?: boolean, err?: any) => void): Promise<void> {
    try {
        await axios.post('/auth/signout', data,  {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('tmAccessToken')
        }});
        callback(true, undefined);
    } catch (err) {
        callback(false, err);
    } 
}