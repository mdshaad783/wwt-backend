import path from "path"
import express from 'express'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import cors from "cors";

dotenv.config();
const port = process.env.PORT
connectDB()
const app = express()


            // Production
const allowedOrigins = [
  "https://walkwithtrends.vercel.app", // deployed frontend
  "http://localhost:5173"              // local frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl/postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


        // Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/users", userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload',uploadRoutes)
app.use('/api/orders',orderRoutes)


app.get('/api/config/paypal', (req,res)=>{
    res.send({clientId:process.env.PAYPAL_CLIENT_ID})
})

        // Paytm routes
// app.get('/api/config/paypal', (req,res)=>{
//     res.send({clientId:process.env.PAYPAL_CLIENT_ID})
// })


const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname + "/uploads")))


app.listen(port,()=>{
    console.log(`Server listening on port: ${port}`);
})