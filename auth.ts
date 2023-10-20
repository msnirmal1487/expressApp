
const fs = require('fs');
import * as crypto from 'crypto';

const FILE_PATH = './users.json';
export const DATE_FORMAT: string = 'yyyy/MM/dd HH:mm:ss z';

export interface UserFile {
    users: User[];
};

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    uniqueIdString: string;
    createdAt: string;
}

export interface LoginData {
    email: string;
    password: string;
}

interface AuthService { 
    register(user: User): void;
    login(email: string, password: string): User | undefined;
    getUserByUniqueId(id: string): User | undefined;
}

export const authService: AuthService = {
    register,
    login,
    getUserByUniqueId
};

function createUserFile(): void {
    const userFile: UserFile = {
        users: []
    };
    const data = JSON.stringify(userFile);
    fs.writeFileSync(FILE_PATH, data);
};

function readUsers(): UserFile | undefined {
    if (!fs.existsSync(FILE_PATH)) {
        createUserFile();
    }
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    const users = JSON.parse(data);
    return users;
};

function register(user: User): User | undefined {
    const userFile = readUsers();
    if (!userFile) {
        return undefined;
    }
    const users = userFile.users;
    // 
    const index = users.findIndex((u: User) => { return u.email === user.email; });
    if(index !== -1) {
        return undefined;
    }
    user.createdAt = new Date().toISOString();
    let uniqueId = crypto.randomBytes(16).toString('hex');
    while(users.findIndex((u: User) => { return u.uniqueIdString === uniqueId; }) >= 0){
        uniqueId = crypto.randomBytes(16).toString('hex');
    } 
    
    user.uniqueIdString = uniqueId;
    user.id = users.length + 1; 

    users.push(user);
    const data = JSON.stringify(userFile);
    fs.writeFileSync(FILE_PATH, data);
    return user;
};

function login(email: string, password: string): User | undefined {
    const userFile = readUsers();
    if (!userFile) {
        return undefined;
    }
    const users = userFile.users;
    return users.find((user: User) => {
        return user.email === email && user.password === password;
    });
};

function getUserByUniqueId(id: string): User | undefined {
    const userFile = readUsers();
    if (!userFile) {
        return undefined;
    }
    const users = userFile.users;
    return users.find((user: User) => {
        return user.uniqueIdString === id;
    });
};