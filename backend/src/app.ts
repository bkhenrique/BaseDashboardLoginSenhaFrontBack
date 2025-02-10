import express from 'express';
import cors from 'cors';
require('dotenv')
require("dotenv").config();
import {env} from 'process';
import { errorHandler } from './middleware/errorMiddleware';
import {router as LoguinRouter} from './routes/auth.routes';
import dbConnect from './config/db';
import cookieParser from "cookie-parser";

const PORT = env.NODE_PORT || 5000;
const app = express();
dbConnect();
app.use(
  cors({
    origin: "http://localhost:3000", // A URL do seu frontend
    credentials: true, // Permite o envio de cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   // res.setHeader(
//   //   'Access-Control-Allow-Headers',
//   //   'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   // );
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );

//   next();
// });
app.use('/api/v1', LoguinRouter);
//Parse request body

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


//quando instaalar swagger
//app.use(`/api/v1/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Error Handler;
app.use(errorHandler);

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});
