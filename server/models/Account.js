import mongoose from 'mongoose';

const { Schema } = mongoose;

const AccountSchema = new Schema({
    email: { type: String, required: true, index: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true }
});

const Account = mongoose.models?.Account || mongoose.model('Account', AccountSchema);
export default Account;
