import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sachin9936088_db_user:XqRxFY37iWfclT8A@sachin.w0vvaxs.mongodb.net/pizza-del').then(() => console.log("DB connected"));
}