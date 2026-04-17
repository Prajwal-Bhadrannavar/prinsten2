"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const doctorController_1 = require("../controllers/doctorController");
const router = (0, express_1.Router)();
// Doctor verification and profile
router.post('/verify', auth_1.authenticate, doctorController_1.submitDoctorVerification);
router.get('/profile', auth_1.authenticate, doctorController_1.getDoctorProfile);
// Article management (for verified doctors)
router.post('/articles', auth_1.authenticate, doctorController_1.createArticle);
router.get('/articles', auth_1.authenticate, doctorController_1.getDoctorArticles);
router.put('/articles/:id', auth_1.authenticate, doctorController_1.updateArticle);
router.delete('/articles/:id', auth_1.authenticate, doctorController_1.deleteArticle);
// Public articles (for everyone)
router.get('/articles/published', doctorController_1.getAllPublishedArticles);
exports.default = router;
