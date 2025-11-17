const Section = require("../models/section");

module.exports = {
    AuthRoute : require("./auth_route"),
    UserRoute : require("./user_route"),
    AuditRoute : require("./audit_route"),
    QuestionRoute : require("./question_route"),
    QuestionCategoryRoute : require("./question_category_route"),
    EquipementsRoute : require("./equipements.route"),
    SectionRoute : require("./section.route"),
    ScanRoute : require("./scan_route")
}
