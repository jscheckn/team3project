import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Account from "../models/Account.js";

const secretKey = 'This is a probably poorly chosen secret key.';

export const createAccount = async (email, password, name, age) => {
    const existingUser = await Account.findOne({email}).exec();
    if (existingUser !== null)
        throw new Error();
    password = await bcrypt.hash(password, 10);
    return Account.create({email, password, name, age});
};

export const login = async (email, password) => {
    const user = await Account.findOne({email}).exec();
    if (user === null || !await bcrypt.compare(password, user.password))
        throw new Error();
    return jwt.sign({email}, secretKey);
};

export const validate = async (token) => {
    return jwt.verify(token, secretKey);
};
