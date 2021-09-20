const express = require('express');
const path = require('path');

const app = express();
app.use('/static', express.static('public'));

app.get('/', (req, res) => 
{
  res.sendFile(path.join(__dirname, 'main.html'));

});

app.get('/GetQuestionJSON', (req, res)=>
{
    res.sendFile(path.join(__dirname, 'Questions.json'));
});

app.get('/GetSingleAnswerMCQuestionTemplate', (req, res)=>
{
    res.sendFile(path.join(__dirname, '/HTMLTemplates/SingleAnswerMCQuestion.html'));
});

app.get('/GetMultipleAnswerMCQuestionTemplate', (req, res)=>
{
    res.sendFile(path.join(__dirname, '/HTMLTemplates/MultipleAnswerMCQuestion.html'));
});

app.get('/GenerateClickAndDragQuestionTemplate', (req, res)=>
{
    res.sendFile(path.join(__dirname, '/HTMLTemplates/GenerateClickAndDragQuestionTemplate.html'));
});

app.get('/GenerateSummaryScreenTemplate', (req, res)=>
{
    res.sendFile(path.join(__dirname, '/HTMLTemplates/SummaryScreen.html'));
});



app.listen(3000, () => console.log('Connect to server by url localhost:3000'));