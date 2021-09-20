var SINGLEANSWERMCQUESTION = 'SingleAnswerMCQuestion';
var MULTIPLEANSWERMCQUESTION = 'MultipleAnswerMCQuestion';
var CLICKANDDRAGQUESTION = 'ClickAndDragQuestion';
var OPTIONS = "Options";
var CONTENT = "Content";
var INSTRUCTIONS = "Instructions";
var BUTTON = "Button";
var TYPE = 'Type';
var ANSWERS = 'Answers';
var DRAGANSWER = "DragAnswer";
var CORRECTMESSAGE = "CorrectMessage";
var INCORRECTMESSAGE = "IncorrectMessage";
var PARTIALCORRECTMESSAGE = "PartialCorrectMessage";
var correctAnswers = 0;


function GenerateQuiz()
{
    $.getJSON("/GetQuestionJSON", function (data)
    {
        console.log(data);
        $("body").empty();
        GenerateQuestionsHTML(data);
    }).fail(function()
    {
        console.log("An Error has occured...");
    })
}

function GenerateQuestionsHTML(data)
{
    for(var i = 0; i < data.length; ++i)
    {
        var currentQuestion = data[i];
        var currentQuestionType = currentQuestion[TYPE];
        if(currentQuestionType === SINGLEANSWERMCQUESTION)
        {
            GenerateSingleAnswerMCQuestion(data, i);
        }
        else if(currentQuestionType === MULTIPLEANSWERMCQUESTION)
        {
            GenerateMultipleAnswerMCQuestion(data, i);
        }
        else if(currentQuestionType === CLICKANDDRAGQUESTION)
        {
            GenerateClickAndDragQuestion(data, i);
        }
    }

    NextQuestion(0, 0, data);
}

function NextQuestion(previousQuestionIndex, nextQuestionIndex, currentQuestions)
{
    HideQuestion(previousQuestionIndex);
    if(nextQuestionIndex >= currentQuestions.length)
    {
        ShowSummaryScreen(currentQuestions);
    }
    else
    {
        ShowQuestion(nextQuestionIndex);
    }
}

function ShowQuestion(questionIndex)
{
    $("#question"+questionIndex).attr('hidden', false);
}
function HideQuestion(questionIndex)
{
    $("#question"+questionIndex).attr('hidden', true);
}

function GenerateSingleAnswerMCQuestion(currentQuestions, questionIndex)
{
    $.ajax(
    {
        url:"/GetSingleAnswerMCQuestionTemplate",
        async: false,
        success: function(result)
        {
            var questionName = "question"+questionIndex;
            result = result.replaceAll("|questionName|", questionName);
            console.log(result);
            $("body").append(result);
            QuestionSetup(questionName, questionIndex, currentQuestions);
            SingleAnswerMCQuestionDropdownSetup(questionName, questionIndex, currentQuestions)
        }
    });
}

function QuestionSetup(questionName, questionIndex, currentQuestions) 
{
    var currentQuestion = currentQuestions[questionIndex];
    $("#" + questionName + CONTENT).append(currentQuestion[CONTENT]);
    $("#" + questionName + INSTRUCTIONS).append(currentQuestion[INSTRUCTIONS]);
    $("#" + questionName + BUTTON).click(function () { NextQuestion(questionIndex, questionIndex + 1, currentQuestions,); });
}

function SingleAnswerMCQuestionDropdownSetup(questionName, questionIndex, currentQuestions) 
{
    var currentQuestion = currentQuestions[questionIndex]; 
    var output = "";
    var optionTemplate = "<option>|optionContent|</option>";
    for (var i = 0; i < currentQuestion[OPTIONS].length; ++i) 
    {
        output += optionTemplate.replace("|optionContent|", currentQuestion[OPTIONS][i]);
    }
    $("#" + questionName + OPTIONS).html(output);
}

function GenerateMultipleAnswerMCQuestion(currentQuestions, questionIndex)
{
    $.ajax(
    {
        url:"/GetMultipleAnswerMCQuestionTemplate",
        async: false,
        success: function(result)
        {
            var questionName = "question"+questionIndex;
            result = result.replaceAll("|questionName|", questionName);
            console.log(result);
            $("body").append(result);
            QuestionSetup(questionName, questionIndex, currentQuestions);
            MultipleAnswerMCQuestionCheckboxSetup(questionName, questionIndex, currentQuestions)
        }
    });
}

function MultipleAnswerMCQuestionCheckboxSetup(questionName, questionIndex, currentQuestions)
{
    var currentQuestion = currentQuestions[questionIndex]; 
    var output = "";
    var optionTemplate = "<input type = 'checkbox' id='|questionOptionId|'><label>|optionContent|</label><br>";
    for (var i = 0; i < currentQuestion[OPTIONS].length; ++i) 
    {
        var temp =   optionTemplate.replaceAll("|optionContent|", currentQuestion[OPTIONS][i])
        output += temp.replace("|questionOptionId|", questionName+"OptionIndex"+i);
    }
    $("#" + questionName + OPTIONS).html(output);
}



function GenerateClickAndDragQuestion(currentQuestions, questionIndex)
{
    $.ajax(
    {
        url:"/GenerateClickAndDragQuestionTemplate",
        async: false,
        success: function(result)
        {
            var questionName = "question"+questionIndex;
            result = result.replaceAll("|questionName|", questionName);
            $("body").append(result);
            QuestionSetup(questionName, questionIndex, currentQuestions);
            
            ClickAndDragQuestionSetup(questionName, questionIndex, currentQuestions)
        }
    });
}

function ClickAndDragQuestionSetup(questionName, questionIndex, currentQuestions)
{
    var currentQuestion = currentQuestions[questionIndex]; 
    var output = "";
    var optionTemplate = "<label draggable='true' ondragstart='drag(event)'>|optionContent|</label><br>";
    for (var i = 0; i < currentQuestion[OPTIONS].length; ++i) 
    {
        output += optionTemplate.replace("|optionContent|", currentQuestion[OPTIONS][i]);
    }
    $("#" + questionName + OPTIONS).html(output);
}


function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.innerText);
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.innerText = data;
  }

 function ShowSummaryScreen(currentQuestions)
 {
     
    $.ajax(
        {
            url:"/GenerateSummaryScreenTemplate",
            async: false,
            success: function(result)
            {
                $("body").append(result);
                for(var i = 0; i < currentQuestions.length; ++i)
                {
                    var currentQuestion = currentQuestions[i];
                    var currentQuestionType = currentQuestion[TYPE];
                    if(currentQuestionType === SINGLEANSWERMCQUESTION)
                    {
                        HandleSingleAnswerQuestionAnswers(currentQuestions, i);
                    }
                    else if(currentQuestionType === MULTIPLEANSWERMCQUESTION)
                    {
                        HandleMultipleAnswerQuestionAnswers(currentQuestions, i);
                    }
                    else if(currentQuestionType === CLICKANDDRAGQUESTION)
                    {
                        HandleMClickAndDragQuestionAnswers(currentQuestions, i);
                    }
                }
                HandleFinalScore(currentQuestions);
            }
        });
 }

 function HandleSingleAnswerQuestionAnswers(currentQuestions, questionIndex)
 {
     var currentQuestion = currentQuestions[questionIndex];
    var questionName = "question"+questionIndex+OPTIONS;
    var answer = $('#' + questionName).val();
    if(answer === currentQuestion[ANSWERS][0])
    {
        HandleCorrectQuestion(currentQuestion, questionIndex);
    }
    else
    {
        HandleIncorrectQuestion(currentQuestion, questionIndex);
    }
 }

 function HandleMultipleAnswerQuestionAnswers(currentQuestions, questionIndex)
 {
     var currentQuestion = currentQuestions[questionIndex];
    var questionName = "question"+questionIndex;
    var correctAnswers = 0;
    for(var i = 0; i < currentQuestion[OPTIONS].length; ++i)
    {
        if($("#"+questionName+"OptionIndex"+i).is(":checked"))
        {
            ++correctAnswers;
        }
    }
    if(correctAnswers === currentQuestion[ANSWERS].length)
    {
        HandleCorrectQuestion(currentQuestion, questionIndex);
    }
    else if(correctAnswers === 0)
    {
        HandleIncorrectQuestion(currentQuestion, questionIndex);
    }
    else
    {
        HandlePartialCorrectQuestion(currentQuestion, questionIndex);
    }
 }

 function HandleMClickAndDragQuestionAnswers(currentQuestions, questionIndex)
 {
     var currentQuestion = currentQuestions[questionIndex];
    var questionName = "question"+questionIndex+DRAGANSWER;
    var answer = $('#' + questionName).text();
    if(answer === currentQuestion[ANSWERS][0])
    {
        HandleCorrectQuestion(currentQuestion, questionIndex);
    }
    else
    {
        HandleIncorrectQuestion(currentQuestion, questionIndex);
    }
 }

 function HandleCorrectQuestion(currentQuestion, questionIndex)
 {
     var htmlTemp = "<h3> Question " + questionIndex +": "+currentQuestion[CORRECTMESSAGE]+"</p>"
     $("body").append(htmlTemp);
     ++correctAnswers;
 }

 function HandleIncorrectQuestion(currentQuestion, questionIndex)
 {
    var htmlTemp = "<h3> Question " + questionIndex +": "+currentQuestion[INCORRECTMESSAGE]+"</p>"
    $("body").append(htmlTemp);
 }

 function HandlePartialCorrectQuestion(currentQuestion, questionIndex)
 {
    var htmlTemp = "<h3> Question " + questionIndex +": "+currentQuestion[PARTIALCORRECTMESSAGE]+"</p>"
    $("body").append(htmlTemp);
 }

 function HandleFinalScore(currentQuestions)
 {
    var htmlTemp = "<h2>You got " + correctAnswers + "/" + currentQuestions.length + ": " + Math.round((correctAnswers/currentQuestions.length)*100) + "%";
    $("body").append(htmlTemp);
 }