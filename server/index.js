//bcryptjs - шифровать пароль
//config - пакет для конфигурации node
// express-validator - роверку данных формы в Node.js с помощью express-validator
//express-fileupload - для загрузки файлов на сервак
//mongoose - библиотека JavaScript, часто используемая в приложении Node.js с базой данных MongoDB.
// nodemon - Она заключает в оболочку ваше приложение Node, наблюдает за файловой системой и автоматически перезапускает процесс.

const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const fileUpload = require("express-fileupload");
const app = express(); // из экспрес создаем сам сервер
const PORT = process.env.PORT || config.get("serverPort");
const corsMiddleWear = require("./middleware/cors.middleware");
const filePathMiddleWear = require("./middleware/filepath.middleware");
// const staticPathMiddleware = require("./middleware/staticPathMiddleware")
const path = require("path");

app.use(fileUpload({}));
app.use(corsMiddleWear);
app.use(filePathMiddleWear(path.resolve(__dirname, "files")));
// app.use(staticPathMiddleware(path.resolve(__dirname, 'static')))
app.use(express.json());
app.use(express.static("static"));
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);
mongoose.set("strictQuery", false);

//функц подключения к базе данных и запускать сервер
const start = async () => {
  try {
    const uri = config.get("dbUrl");
    console.log(uri);
    mongoose.connect(uri, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    //сервер слушает порт
    app.listen(PORT, () => {
      console.log("---!!!------!!!--- Server started on port ", PORT);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
