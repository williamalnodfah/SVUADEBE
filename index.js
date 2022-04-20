const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
var cors = require('cors');
var hostname = 'localhost';
var port = '3000';

var app = express();
var subjectsRouter = express.Router();
var subjectQuestionsRouter = express.Router();
var questionsRouter = express.Router();
var subjects = [
    {
        "id": 1,
        "name": "ADE",
        "teacher": "Mr. Dr Ehsan Alrefaee",
        "desc": "MWS subject studies data exchange technologies"
    },
    {
        "id": 2,
        "name": "AWP",
        "teacher": "Mr. Dr Basel Alkhatib",
        "desc": "MWS subject studies web application programing"
    },
    {
        "id": 3,
        "name": "ADM",
        "teacher": "Mr. Dr Basel Alkatib",
        "desc": "MWS subject studies data mining algorithms"
    },
    {
        "id": 4,
        "name": "ADP",
        "teacher": "Mrs. Dr Sia Astor",
        "desc": "MWS subject studies distributed web applications"
    },
    {
        "id": 5,
        "name": "AWE",
        "teacher": "Mr. Dr Mhd Said Abo Trab",
        "desc": "MWS subject studies web application engineering principles"
    }
];

var subjectsExams = [
    {
        "subId": 1,
        "examId": 1,
        "name": "F21 Exam",
        "questions": [
            {
                "questionHeader": "What does XML stand for?",
                "choices": [
                    "eXtensible Markup Languag",
                    "eXtra Modern Link",
                    "eXtra Modern Link",
                    "Example Markup Language"
                ]
            },
            {
                "questionHeader": "What does JSONP stand for?",
                "choices": [
                    "JSON parsing",
                    "JSON parameter",
                    "JSON with padding",
                    "JSON programming"
                ]
            },
            {
                "questionHeader": "Which one of the following is required if we want to generate JSON object from WCF?",
                "choices": [
                    "choice one",
                    "choice two",
                    "choice three",
                    "none of above"
                ]
            }
        ]
    },
    {
        "subId": 1,
        "examId": 2,
        "name": "s21 Exam",
        "questions": [
            {
                "questionHeader": "Which of these is correct about the JSON standard?",
                "choices": [
                    "It is an open standard",
                    "It is privately developed",
                    "It requires a license to use",
                    "none of above"
                ]
            },
            {
                "questionHeader": "Which of the following is the limitation of JSON?",
                "choices": [
                    "Too many data types",
                    "Complicated debugging",
                    "Support for only C",
                    "No limit on arrays and objects"
                ]
            }
        ]
    }

];


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
subjectsRouter.route('/').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
}).get((req, res, next) => {
    res.end(JSON.stringify(subjects));
}).post((req, res, next) => {
    subjects.push(req.body);
    res.end(JSON.stringify(subjects));
});


subjectsRouter.route('/:subId').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
}).get((req, res, next) => {
    res.end(JSON.stringify(subjects.filter(x => x.id == req.params.subId)));
}).put((req, res, next) => {
    let index = subjects.findIndex(x => x.id == req.params.subId);
    subjects[index] = req.body;
    res.end(JSON.stringify(subjects));
}).delete((req, res, next) => {
    let index = subjects.findIndex(x => x.id == req.params.subId);
    subjects.splice(index, 1);
    res.end(JSON.stringify(subjects));
});

subjectQuestionsRouter.route('/:subId').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
}).get((req, res, next) => {
    res.end(JSON.stringify(subjectsExams.filter(x => x.subId == req.params.subId)));
}).post((req, res, next) => {
    let number = Math.max(...subjectsExams.map(x => x.examId)) + 1;
    subjectsExams.push({
        ...req.body, "examId": number
    });
    res.end(JSON.stringify(subjectsExams.filter(x => x.subId == req.params.subId)));
});


questionsRouter.route('/:examId').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
}).post((req, res, next) => {
    let index = subjectsExams.findIndex(x => x.examId == req.params.examId);
    console.log(index);
    subjectsExams[index].questions.push(req.body);
    console.log(subjectsExams[index].questions);
    res.end(JSON.stringify(subjectsExams[index].questions));
}).get((req, res, next) => {
    let index = subjectsExams.findIndex(x => x.examId == req.params.examId);
    res.end(JSON.stringify(subjectsExams[index].questions));
});




app.use('/subjects', subjectsRouter);
app.use('/subjectQuestions', subjectQuestionsRouter);
app.use('/questions', questionsRouter);



const server = http.createServer(app);

server.listen(port, hostname, (req, res, next) => {
    console.log(`Server is running at http://${hostname}:${port}`);
});