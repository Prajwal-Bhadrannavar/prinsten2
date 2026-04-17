"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const assessmentController_1 = require("../controllers/assessmentController");
const router = express_1.default.Router();
router.get('/questions', assessmentController_1.getQuestions);
router.post('/calculate', assessmentController_1.calculateRisk);
router.post('/save', auth_1.authenticate, assessmentController_1.saveAssessment);
router.get('/history', auth_1.authenticate, assessmentController_1.getAssessmentHistory);
exports.default = router;
