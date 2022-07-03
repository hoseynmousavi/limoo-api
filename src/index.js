import express from "express"
import cors from "cors"
import fileUpload from "express-fileupload"
import mongoose from "mongoose"
import data from "./data"
import notFoundRouter from "./routes/notFoundRouter"
import otpRouter from "./routes/otpRouter"
import userRouter from "./routes/userRouter"
import packRouter from "./routes/packRouter"
import cartRouter from "./routes/cartRouter"

// import xlsx from "node-xlsx"
// import cartController from "./controllers/cartController"
//
// const workSheetsFromFile = xlsx.parse(`${__dirname}/book1.xlsx`)
//
// for (let i = 0; i < workSheetsFromFile[0].data.length; i++)
// {
//     setTimeout(() =>
//     {
//         const item = workSheetsFromFile[0].data[i]
//         cartController._add({pack_id: "62b7c22dc59ac15ac15983ef", front: item[0], back: item[1], back_description: item[2]})
//         cartController._add({pack_id: "62c198b4927fcc71fc526869", front: item[0], back: item[1], back_description: item[2]})
//         cartController._add({pack_id: "62c1ec0c24d2bd2e24c81a38", front: item[0], back: item[1], back_description: item[2]})
//     }, 100)
// }

const app = express()
app.use(cors())
app.use(fileUpload({createParentPath: true}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

mongoose.Promise = global.Promise
mongoose.connect(data.connectServerDb, null, () => console.log("connected to db"))

otpRouter(app)
userRouter(app)
packRouter(app)
cartRouter(app)
notFoundRouter(app)

app.listen(data.port, () => console.log(`server is Now Running on Port ${data.port}`))