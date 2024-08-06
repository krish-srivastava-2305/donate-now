import mongoose from "mongoose";

type connection = {
    isConnected? : number
}

let connection: connection = {}

export const DBConnect = async () => {
    if(connection.isConnected){
        console.log("Already Connected")
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '', {})
        connection.isConnected = db.connection.readyState
        console.log("DB Connection Success")
    } catch (error) {
        console.error("Error Occured while connecting to DB: ", error)
        process.exit(1)
    }
}