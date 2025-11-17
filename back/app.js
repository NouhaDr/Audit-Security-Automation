const express = require("express");
const path = require("path");
const cors = require("cors")
const app = express();
const error_handler = require("./src/utils/error-handler")
const { AuthRoute, UserRoute, AuditRoute, QuestionRoute, QuestionCategoryRoute, EquipementsRoute ,SectionRoute,ScanRoute} = require("./src/routes");

app.use(cors());
app.use(express.json());
app.use("/user_images", express.static(path.join("./src/static/images")));
app.use("/audit_files", express.static(path.join("./src/static/files")));

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/audits", AuditRoute);
app.use("/api/questions", QuestionRoute);
app.use("/api/questions/categories", QuestionCategoryRoute);
app.use("/api/equipements", EquipementsRoute);
app.use("/api/sections", SectionRoute); 
app.use("/api/scan", ScanRoute); 
app.use('/static/files', express.static(path.join(__dirname, './src/static/files')));


app.use(error_handler);

module.exports = app;