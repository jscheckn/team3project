import express from 'express';
import * as accounts from "../data/accounts.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        let {email, password, name, age} = req.body;
        await accounts.createAccount(email, password, name, age);
        return res.status(201).json({message: 'User registered successfully.'});
    } catch (e) {
        return res.status(400).json({error: 'A user already exists with the given email address.'});
    }
});

router.get('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const token = await accounts.login(email, password);
        return res.json(token);
    } catch (e) {
        return res.status(401).json({error: 'Invalid credentials.'});
    }
});

router.get('/validate', async (req, res) => {
    try {
        const decoded = await accounts.validate(req.body.token);
        return res.json(decoded);
    } catch (e) {
        return res.status(401).json({error: 'Invalid token.'});
    }
});

export default router;
