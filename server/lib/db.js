import mongoose from "mongoose";

//Function to connect to the mongodb database
export const connectDB = async ()=>{
    try{
        //event is added
        mongoose.connection.on('connected',()=> console.log('database connected successfully'));

        //make connection
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)

    }catch (error){
       console.log(error);
    }
}