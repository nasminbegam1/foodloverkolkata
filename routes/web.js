var express         = require('express');
var router          = express.Router();
var fs              = require('fs');
var multer          = require('multer');
var path            = require('path');


var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/uploads/");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
var upload = multer({ storage: Storage });

var admin           = require("../controllers/AdminController");
var adminCategory   = require("../controllers/AdminCategoryController");
var adminProduct    = require("../controllers/AdminProductController");
var home            = require("../controllers/HomeController");

//Admin URL
router.get("/admin", admin.login);
router.post("/admin", admin.login_post);
router.get("/admin/dashboard", admin.dashboard);
router.get("/admin/logout", admin.logout);
router.get("/admin/category/list", adminCategory.index);
router.get("/admin/category/create", adminCategory.create);
router.post("/admin/category/create", upload.single('filetoupload'), adminCategory.create_post);
router.get("/admin/category/update/:id", adminCategory.update);
router.post("/admin/category/update/:id", upload.single('filetoupload'), adminCategory.update_post);
router.get("/admin/product/list", adminProduct.index);
router.get("/admin/product/create", adminProduct.create);
router.post("/admin/product/create", upload.single('filetoupload'), adminProduct.create_post);
router.get("/admin/product/update/:id", adminProduct.update);
router.post("/admin/product/update/:id", upload.single('filetoupload'), adminProduct.update_post);

//Frontend URL
router.get("/", home.index);
router.get("/details/:id", home.details);
router.get("/addtocart/:id", home.addtocart);

module.exports = router;