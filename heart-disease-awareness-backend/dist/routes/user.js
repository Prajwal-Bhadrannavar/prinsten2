"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/lifestyle', auth_1.authenticate, userController_1.saveLifestyleData);
router.get('/lifestyle', auth_1.authenticate, userController_1.getLifestyleData);
router.get('/insights', auth_1.authenticate, userController_1.getHealthInsights);
exports.default = router;
