"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessmentHistory = exports.saveAssessment = exports.calculateRisk = exports.getQuestions = void 0;
const Assessment_1 = __importDefault(require("../models/Assessment"));
const riskQuestions = [
    {
        id: 1,
        question: 'Age range',
        category: 'clinical',
        source: 'Framingham Heart Study predictors',
        options: [
            { label: '18-39 years', value: 'age_18_39', score: 0 },
            { label: '40-54 years', value: 'age_40_54', score: 4 },
            { label: '55-64 years', value: 'age_55_64', score: 8 },
            { label: '65+ years', value: 'age_65_plus', score: 12 }
        ]
    },
    {
        id: 2,
        question: 'Systolic blood pressure status',
        category: 'clinical',
        source: 'AHA blood pressure guidance',
        options: [
            { label: 'Usually below 120 mmHg', value: 'bp_optimal', score: 0 },
            { label: 'Usually 120-129 mmHg', value: 'bp_elevated', score: 3 },
            { label: 'Usually 130-139 mmHg', value: 'bp_stage_1', score: 7 },
            { label: 'Usually 140+ mmHg or on BP medication', value: 'bp_stage_2_or_treated', score: 12 }
        ]
    },
    {
        id: 3,
        question: 'Blood sugar / diabetes status',
        category: 'clinical',
        source: 'AHA Life Essential 8',
        options: [
            { label: 'No diabetes and normal sugar levels', value: 'diabetes_none', score: 0 },
            { label: 'Prediabetes / borderline sugar', value: 'diabetes_prediabetes', score: 5 },
            { label: 'Diabetes diagnosed', value: 'diabetes_yes', score: 10 }
        ]
    },
    {
        id: 4,
        question: 'Cholesterol status',
        category: 'clinical',
        source: 'AHA Life Essential 8',
        options: [
            { label: 'Normal cholesterol in recent tests', value: 'cholesterol_normal', score: 0 },
            { label: 'Not sure / not checked recently', value: 'cholesterol_unknown', score: 4 },
            { label: 'High cholesterol diagnosed', value: 'cholesterol_high', score: 9 }
        ]
    },
    {
        id: 5,
        question: 'Smoking / tobacco exposure',
        category: 'behavior',
        source: 'WHO + AHA tobacco risk factors',
        options: [
            { label: 'Never smoked and no regular secondhand exposure', value: 'smoke_never', score: 0 },
            { label: 'Past smoker, currently quit', value: 'smoke_former', score: 3 },
            { label: 'Current smoker / vaping nicotine', value: 'smoke_current', score: 12 }
        ]
    },
    {
        id: 6,
        question: 'Weekly physical activity',
        category: 'behavior',
        source: 'WHO and AHA activity recommendations',
        options: [
            { label: '150+ minutes moderate or 75+ vigorous', value: 'activity_guideline_met', score: 0 },
            { label: '60-149 minutes per week', value: 'activity_low', score: 4 },
            { label: 'Less than 60 minutes per week', value: 'activity_very_low', score: 8 }
        ]
    },
    {
        id: 7,
        question: 'Body weight / BMI',
        category: 'behavior',
        source: 'AHA Life Essential 8',
        options: [
            { label: 'BMI below 25', value: 'bmi_healthy', score: 0 },
            { label: 'BMI 25-29.9', value: 'bmi_overweight', score: 4 },
            { label: 'BMI 30 or above', value: 'bmi_obesity', score: 8 }
        ]
    },
    {
        id: 8,
        question: 'Sleep duration (average/night)',
        category: 'behavior',
        source: 'AHA Life Essential 8',
        options: [
            { label: '7-9 hours', value: 'sleep_healthy', score: 0 },
            { label: '6-7 hours or 9-10 hours', value: 'sleep_borderline', score: 3 },
            { label: 'Less than 6 hours', value: 'sleep_low', score: 6 }
        ]
    },
    {
        id: 9,
        question: 'Diet quality (salt, processed food, fruits/vegetables)',
        category: 'behavior',
        source: 'WHO CVD diet risk factors',
        options: [
            { label: 'Mostly whole foods with regular fruits/vegetables', value: 'diet_good', score: 0 },
            { label: 'Mixed diet with frequent salty/processed foods', value: 'diet_mixed', score: 5 },
            { label: 'Often high-salt processed/fried foods', value: 'diet_poor', score: 9 }
        ]
    },
    {
        id: 10,
        question: 'Alcohol use pattern',
        category: 'behavior',
        source: 'WHO CVD behavioral risk factors',
        options: [
            { label: 'No alcohol or occasional light intake', value: 'alcohol_low', score: 0 },
            { label: 'Moderate regular intake', value: 'alcohol_moderate', score: 3 },
            { label: 'Heavy or binge drinking pattern', value: 'alcohol_high', score: 8 }
        ]
    }
];
const toBoundedScore = (raw, max) => {
    return Math.round((Math.max(0, raw) / max) * 100);
};
const getQuestions = (req, res) => {
    try {
        res.json(riskQuestions);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getQuestions = getQuestions;
const calculateRisk = (req, res) => {
    try {
        const { responses } = req.body;
        const responseMap = new Map();
        if (!Array.isArray(responses) || responses.length === 0) {
            return res.status(400).json({ message: 'Responses are required' });
        }
        responses.forEach((response) => {
            const normalizedAnswer = typeof response.value === 'string'
                ? response.value
                : (response.answer ? 'yes' : 'no');
            responseMap.set(response.questionId, normalizedAnswer);
        });
        let clinicalRaw = 0;
        let behavioralRaw = 0;
        let clinicalMax = 0;
        let behavioralMax = 0;
        riskQuestions.forEach((question) => {
            const maxScore = Math.max(...question.options.map((option) => option.score));
            if (question.category === 'clinical') {
                clinicalMax += maxScore;
            }
            else {
                behavioralMax += maxScore;
            }
            const answerValue = responseMap.get(question.id);
            const selectedOption = question.options.find((option) => option.value === answerValue);
            const selectedScore = selectedOption ? selectedOption.score : 0;
            if (question.category === 'clinical') {
                clinicalRaw += selectedScore;
            }
            else {
                behavioralRaw += selectedScore;
            }
        });
        const clinicalRiskIndicator = toBoundedScore(clinicalRaw, clinicalMax || 1);
        const awarenessScore = toBoundedScore(behavioralRaw, behavioralMax || 1);
        const riskScore = Math.round((clinicalRiskIndicator * 0.6) + (awarenessScore * 0.4));
        let riskLevel;
        let recommendations;
        if (riskScore <= 33) {
            riskLevel = 'low';
            recommendations = [
                'Continue maintaining your current healthy routines',
                'Keep meeting weekly activity targets (150+ minutes moderate or 75+ vigorous)',
                'Monitor blood pressure, blood sugar, and cholesterol at routine checkups',
                'Maintain sleep quality and balanced, low-sodium food choices'
            ];
        }
        else if (riskScore <= 66) {
            riskLevel = 'moderate';
            recommendations = [
                'Schedule a preventive consultation with your healthcare provider',
                'Prioritize tobacco cessation and reduce alcohol if applicable',
                'Adopt a heart-healthy eating pattern with less salt and processed foods',
                'Increase physical activity progressively toward WHO/AHA targets',
                'Track blood pressure and blood glucose more consistently'
            ];
        }
        else {
            riskLevel = 'high';
            recommendations = [
                'Arrange prompt clinical evaluation with a physician or cardiologist',
                'Review blood pressure, glucose, and lipid profile with a clinician soon',
                'Begin a structured risk-reduction plan: smoking cessation, diet, activity, sleep',
                'Do not delay care if chest pain, severe breathlessness, or stroke warning signs appear'
            ];
        }
        res.json({
            riskScore,
            awarenessScore,
            clinicalRiskIndicator,
            riskLevel,
            recommendations,
            methodology: {
                sources: [
                    'American Heart Association: Life Essential 8',
                    'WHO Cardiovascular Disease Risk Factors',
                    'Framingham Heart Study predictor variables'
                ]
            },
            disclaimer: 'This awareness tool is educational and not a medical diagnosis. Consult a licensed clinician for diagnosis or treatment decisions.',
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.calculateRisk = calculateRisk;
const saveAssessment = async (req, res) => {
    try {
        const { responses, riskScore, riskLevel, recommendations, awarenessScore, clinicalRiskIndicator } = req.body;
        const normalizedResponses = Array.isArray(responses)
            ? responses.map((item) => ({
                questionId: item.questionId,
                answer: typeof item.answer === 'string'
                    ? item.answer
                    : (typeof item.value === 'string' ? item.value : String(Boolean(item.answer)))
            }))
            : [];
        const assessment = new Assessment_1.default({
            userId: req.user._id,
            responses: normalizedResponses,
            riskScore,
            riskLevel,
            awarenessScore,
            clinicalRiskIndicator,
            recommendations,
        });
        await assessment.save();
        res.status(201).json({
            message: 'Assessment saved successfully',
            assessment,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.saveAssessment = saveAssessment;
const getAssessmentHistory = async (req, res) => {
    try {
        const assessments = await Assessment_1.default.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(assessments);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAssessmentHistory = getAssessmentHistory;
