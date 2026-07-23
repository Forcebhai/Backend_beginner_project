
import "dotenv/config"
import dotenv from "dotenv"

import connectDB from "./db/index.js"
import { app } from "./app.js";
import path from "path";
import dns from "dns"

dns.setServers(['1.1.1.1', '8.8.8.8'])
dotenv.config({
  path: './.env'
})

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Error: ", error);
      throw error
    })

    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at port : ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log("Mongo DB connection failed !!! ", err);
  })





/*  basic approach to connect to mongodb and start the server
import express from "express"

const app = express()

( async () => {

  try{
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
      console.error("Error: ",error);
      throw error
    })

    app.listen(process.env.PORT,()=>{
      console.log(`Server is running on port ${process.env.PORT}`)
    })
  }
  catch(err){
    console.error("Error: ",error)
  }

})()
*/
