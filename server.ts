import { LoginData, authService, User } from './auth';

const e = require('express');
const app = e();
const port = 3001;
const cors = require('cors');

app.use(cors({origin: true}));

app.use(e.json());

import { Response } from 'express';

app.post('/api/login', (req: { body: LoginData; }, res: Response<User | any>) => {

    const loginData = req.body as LoginData;
    const user = authService.login(loginData.email, loginData.password);
    // return user or 401 depending on whether user exists
    if (user !== undefined) {
        res.status(200).json(user);
    } else {
        res.status(401).json({message: 'Login failed!'});
    }
});

app.post('/api/register', (req: { body: User; }, res: Response<User|any>) => {
    const user = req.body as User;
    const userCreated = authService.register(user);
    if(userCreated !== undefined) {
        res.status(201).json(userCreated);
    } else {
        res.status(401).json({message: 'User already exists!'});
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});