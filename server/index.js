const express = require("express");
const upload = require("express-fileupload");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./db/dbConnect");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { server, app } = require("./socket/socket");

// ✅ Kết nối DB
dbConnect();

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

// ✅ CORS — cho phép cả localhost (khi dev) và domain Vercel (khi deploy)
const allowedOrigins = [
    "http://localhost:5173",           // local dev
    "https://sm-fe.vercel.app",        // ⚠️ thay bằng domain thật trên Vercel
];

app.use(
    cors({
        credentials: true,
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
    })
);

app.use(upload());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Error middleware
app.use(notFound);
app.use(errorHandler);

// ✅ PORT phải linh hoạt (Render tự cấp)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
