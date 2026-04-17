"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
// Admin routes for doctor verification
router.get('/doctors/pending', auth_1.authenticate, adminController_1.getPendingVerifications);
router.get('/doctors/all', auth_1.authenticate, adminController_1.getAllDoctors);
router.post('/doctors/:doctorId/approve', auth_1.authenticate, adminController_1.approveDoctor);
router.post('/doctors/:doctorId/reject', auth_1.authenticate, adminController_1.rejectDoctor);
exports.default = router;
