"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const assessment_1 = __importDefault(require("./routes/assessment"));
const user_1 = __importDefault(require("./routes/user"));
const doctor_1 = __importDefault(require("./routes/doctor"));
const admin_1 = __importDefault(require("./routes/admin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heart-disease-awareness')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use('/api/auth', auth_1.default);
app.use('/api/assessment', assessment_1.default);
app.use('/api/user', user_1.default);
app.use('/api/doctor', doctor_1.default);
app.use('/api/admin', admin_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'Heart Disease Awareness System API' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
