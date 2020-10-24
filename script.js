// quizController

var quizController=(function(){
  function Question(id,questionText,options,correctAnswer){
      this.id=id;
      this.questionText=questionText;
      this.options=options;
      this.correctAnswer=correctAnswer;
  } 
  var questionLocalStorage={
      setQuestionCollection:function(newCollection){
          localStorage.setItem('questionCollection',JSON.stringify(newCollection));
      },
      getQuestionCollection:function(){
          
          return JSON.parse(localStorage.getItem('questionCollection'));
      },
      removeQuestionCollection:function(){
          localStorage.removeItem('questionCollection');
      }
  };
  if(questionLocalStorage.getQuestionCollection()===null)
    {
            questionLocalStorage.setQuestionCollection([]);
    }
    var quizProgress={
        questionIndex:0
    };
// Person Constructor
function Person(id,fname,lname,score){
    this.id=id;
    this.fname=fname;
    this.lname=lname;
    this.score=score;
}
var currPersonData={
    fullname:[],
    score:0
};
var adminFullName=['Nishigandha','DMore'];
var personLocalStorage={
    setPersonData:function(newPersonData){
        localStorage.setItem('personData',JSON.stringify(newPersonData));
    },
    getPersonData:function(){
        return JSON.parse(localStorage.getItem('personData'));
    },
    removePersonData:function(){
        localStorage.removeItem('personData');
    }
};
if(personLocalStorage.getPersonData()===null)
{
    personLocalStorage.setPersonData([]);
}
return{

      getQuizProgress:quizProgress,
      getQuestionLocalStorage:questionLocalStorage,
      addQuestionOnLocalStorage:function(newQuestionText,opts){
        var optionsArr,corrAns,questionId,newQuestion,getStoredQuests; 

        if(questionLocalStorage.getQuestionCollection()===null)
        {
            questionLocalStorage.setQuestionCollection([]);
        }
        optionsArr=[];
        isChecked=false;
        
        for(var i=0;i<opts.length;i++)
        {
            if(opts[i].value!=='')
            {
                optionsArr.push(opts[i].value);
            }
            if(opts[i].previousElementSibling.checked && opts[i].value !=="")
            {
                corrAns=opts[i].value;
                isChecked=true;
            }
        }
        //[{id:}]
        if(questionLocalStorage.getQuestionCollection().length>0){
            questionId=questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length-1].id+1;
        }else{
            questionId=0;
        }
        if(newQuestionText.value!=="")
        {
            if(optionsArr.length>1)
            {
                if(isChecked)
                {
                    newQuestion=new Question(questionId,newQuestionText.value,optionsArr,corrAns);
                    getStoredQuests=questionLocalStorage.getQuestionCollection();
                    getStoredQuests.push(newQuestion);
                    questionLocalStorage.setQuestionCollection(getStoredQuests);
                    newQuestionText.value="";
                    for(var x=0;x<opts.length;x++)
                    {
                        opts[x].value="";
                        opts[x].previousElementSibling.checked=false;
                    }
                    console.log(questionLocalStorage.getQuestionCollection());
                    return true;
                }
                else
                {
                    alert("Please select atlest one option as a correct answer");
                    return false;
                }
                
            }
            else
            {
                alert("Please insert atleast 2 options");
                return false;
            }
        }
        else
        {
            alert("Please insert question");
            return false;
        }
      },
      checkAnswer:function(ans){
        if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer===ans.textContent)
        {
            currPersonData.score++;
            return true;
        }
        else
        {
           return false;
        }
      },
      isFinished:function(){
          return quizProgress.questionIndex+1===questionLocalStorage.getQuestionCollection().length;

      },
      addPerson:function(){
          var newPerson,personId,personData;
          if(personLocalStorage.getPersonData().length>0)
          {
              personId=personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length-1].id+1;
          }
          else{
              personId=0;
          }
          newPerson=new Person(personId,currPersonData.fullname[0],currPersonData.fullname[1],currPersonData.score);
          personData=personLocalStorage.getPersonData();
          personData.push(newPerson);
          personLocalStorage.setPersonData(personData);
          console.log(newPerson);

      },
      getCurrPersonData:currPersonData,
      getAdminFullName:adminFullName,
      getPersonLocalStorage:personLocalStorage
  };
})();
// UIController
var UIController=(function(){
     var domItems={
        //  Admin Panel Elements
         adminPageContainer:document.querySelector('.admin-page-container'),
         questInsertBtn:document.getElementById("question-insert-btn"),
         newQuestionText:document.getElementById('new-question-text'),
         adminOptions:document.querySelectorAll(".admin-option"),
         adminOptionsContainer:document.querySelector(".admin-options-container"),
         insertedQuestionsWrapper:document.querySelector(".inserted-questions-wrapper"),
         questUpdateBtn:document.getElementById("question-update-btn"),
         questDeleteBtn:document.getElementById('question-delete-btn'),
         questionClearBtn:document.getElementById('question-clear-btn'),
         resultsListWrapper:document.querySelector('.results-list-wrapper'),
         resultsClearBtn:document.getElementById('results-clear-btn'),
        //  Quiz Section
         quizContainer:document.querySelector('.quiz-container'),
         askedQuestionText:document.getElementById('asked-question-text'),
         quizOptionsWrapper:document.querySelector(".quiz-options-wrapper"),
         progressBar:document.querySelector("progress"),
         progressPar:document.getElementById("progress"),
         instantAnswerContainer:document.querySelector('.instant-answer-container'),
         instantAnswerText:document.getElementById("instant-answer-text"),
         instantAnswerWrapper:document.getElementById("instant-answer-wrapper"),
         emotionIcon:document.getElementById("emotion"),
         nextQuestionBtn:document.getElementById("next-question-btn"),
        //  landing Page Elements
        landingPageContainer:document.querySelector('.landing-page-container'),
        startQuizBtn:document.getElementById("start-quiz-btn"),
        fname:document.getElementById('fname'),
        lname:document.getElementById('lname'),
        // Final Result Section
        finalResultContainer:document.querySelector(".final-result-container"),
        finalScoreText:document.getElementById("final-score-text")


     }  
     return{
         getDomItems:domItems,
         addInputDynamically:function(){
            
            var addInput=function(){
                var inputHTML,z;
                z=document.querySelectorAll('.admin-option').length;
                inputHTML='<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+z+'" name="answer" value="'+z+'"><input type="text"class="admin-option admin-option-1" value=""></div>';
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend',inputHTML);
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus',addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus',addInput);

        
            }
            
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus',addInput);
        },

        createQuestionList:function(getQuestions){
            var questHTML,numberingArr;
            numberingArr=[];
            domItems.insertedQuestionsWrapper.innerHTML='';
            for(var i=0;i<getQuestions.getQuestionCollection().length;i++)
            {
                numberingArr.push(i+1); 
                questHTML='<p><span>'+ numberingArr[i] +'.'+ getQuestions.getQuestionCollection()[i].questionText+'</span><button id="question-'+ getQuestions.getQuestionCollection()[i].id+'">Edit</button></p>';
                domItems.insertedQuestionsWrapper.insertAdjacentHTML('afterbegin',questHTML);
            }
        },

        editQuestList:function(event,storageQuestList,addInputsDynFn,updateQuestListFn){
            var getId,getStorageQuestList,foundItem,placeInArr,optionHTML;
            placeInArr=[];
            if('question-'.indexOf(event.target.id))
            {
                getId=parseInt(event.target.id.split('-')[1]);
                getStorageQuestList=storageQuestList.getQuestionCollection();
                for(var i=0;i<getStorageQuestList.length;i++)
                {
                    if(getStorageQuestList[i].id===getId)
                    {
                       foundItem=getStorageQuestList[i];
                       placeInArr=i;
                       
                    }
                }
                domItems.newQuestionText.value=foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML='';
                optionHTML='';
                for(var x=0;x<foundItem.options.length;x++)
                {
                    optionHTML+='<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+x+'" name="answer" value="'+x+'"><input type="text" class="admin-option admin-option-'+x+'" value="'+ foundItem.options[x]+'"></div>';
                }
                domItems.adminOptionsContainer.innerHTML=optionHTML;
                domItems.questUpdateBtn.style.visibility="visible";
                domItems.questDeleteBtn.style.visibility="visible";
                domItems.questInsertBtn.style.visibility="hidden";
                domItems.questionClearBtn.style.pointerEvent='none';
                addInputsDynFn();
                var backDefaultView=function(){
                    domItems.newQuestionText.value='';
                    var updatedOptionsEle=document.querySelectorAll('.admin-option');
                    for(var i=0;i<updatedOptionsEle.length;i++)
                    {
                        updatedOptionsEle[i].value='';
                        updatedOptionsEle[i].previousElementSibling.checked=false;
                    }
                    domItems.questUpdateBtn.style.visibility="hidden";
                    domItems.questionClearBtn.style.pointerEvents="";
                    domItems.questDeleteBtn.style.visibility="hidden";
                    domItems.questInsertBtn.style.visibility="visible";
                    updateQuestListFn(storageQuestList);
                }
                var updateQuestion=function(){
                    var newOptions,optElements;
                    newOptions=[];
                    optElements=document.querySelectorAll(".admin-option");
                    foundItem.questionText=domItems.newQuestionText.value;
                    foundItem.correctAnswer='';
                    for(var i=0;i<optElements.length;i++)
                    {
                        if(optElements.value!=='')
                        {
                            newOptions.push(optElements[i].value);
                            if(optElements[i].previousElementSibling.checked)
                            {
                                foundItem.correctAnswer=optElements[i].value;
                            }
                        }
                    }
                    foundItem.options=newOptions;
                    if(foundItem.questionText!=='')
                    {
                        if(foundItem.options.length>1)
                        {
                            if(foundItem.correctAnswer!=='')
                            {
                                getStorageQuestList.splice(placeInArr,1,foundItem);
                                storageQuestList.setQuestionCollection(getStorageQuestList);
                                backDefaultView();
                            }
                            else
                            {
                                alert("you missed to check the answer or you had checked an empty input option");
                            }
                         }
                        else
                        {
                            alert("you must insert atleast two options");
                        }
                    }
                    else
                    {
                        alert("please insert question");
                    }
                }
                domItems.questUpdateBtn.onclick=updateQuestion;
                var deleteQuestion=function(){
                    getStorageQuestList.splice(placeInArr,1);
                    storageQuestList.setQuestionCollection(getStorageQuestList);
                    backDefaultView();
                }
                domItems.questDeleteBtn.onclick=deleteQuestion;
            }

        },
        clearQuestList:function(storageQuestList){
            if(storageQuestList.getQuestionCollection()!==null)
            {
                if(storageQuestList.getQuestionCollection().length>0)
                {
                    var conf=confirm("warning! You will lose entire question list");
                    if(conf)
                    {
                        storageQuestList.removeQuestionCollection();
                        domItems.insertedQuestionsWrapper.innerHTML="";
                    }
                }
                
            }
            else{
                alert("List is empty");
            }
            
        },
        displayQuestion:function(storageQuestList,progress){
            var newOptionHTML,characterArr;
            characterArr=["A","B","C","D","E","F"];
            if(storageQuestList.getQuestionCollection().length>0)
            {
                domItems.askedQuestionText.textContent=storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
                domItems.quizOptionsWrapper.innerHTML='';
                for(var i=0;i<storageQuestList.getQuestionCollection()[progress.questionIndex].options.length;i++)
                {
                    newOptionHTML=' <div class="choice-'+i+'"><span class="choice-'+i+'">'+ characterArr[i]+'</span><p class="choice-'+i+'">'+storageQuestList.getQuestionCollection()[progress.questionIndex].options[i]+'</p></div>';
                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend',newOptionHTML);
                }
            }
        },
        displayProgress:function(storageQuestList,progress){
            domItems.progressBar.max=storageQuestList.getQuestionCollection().length;
            domItems.progressBar.value=progress.questionIndex+1;
            domItems.progressPar.textContent=(progress.questionIndex+1)+'/'+storageQuestList.getQuestionCollection().length;
        },
        newDesign:function(ansResult,selectedAns){
            var twoOptions,index;
            index=0;
            if(ansResult){
                index=1;
            }
            twoOptions={
                instAnswerText:["This is wrong answer",'This is a correct answer'],
                instAnswerClass:['red','green'],
                emotionType:['images/sad.png','images/happy.png'],
                optionSpanBg:['red','green']
            };
            domItems.quizOptionsWrapper.style.cssText="opacity:0.6;pointer-events:none;";
            domItems.instantAnswerContainer.style.opacity="1";
            domItems.instantAnswerText.textContent=twoOptions.instAnswerText[index];
            domItems.instantAnswerWrapper.className=twoOptions.instAnswerClass[index];
            domItems.emotionIcon.setAttribute('src',twoOptions.emotionType[index]);
            selectedAns.previousElementSibling.style.backgroundColor=twoOptions.optionSpanBg[index];

        },
        resetDesign:function(){
            domItems.quizOptionsWrapper.style.cssText="";
            domItems.instantAnswerContainer.style.opacity="0";
        },
        getFullName:function(currPerson,storageQuestList,admin){
            if(domItems.fname.value!=="" && domItems.lname.value!=='')
            {
                if(!(domItems.fname.value===admin[0] && domItems.lname.value===admin[1])){
                    if(storageQuestList.getQuestionCollection().length>0){
                        currPerson.fullname.push(domItems.fname.value);
                        currPerson.fullname.push(domItems.lname.value);
                        domItems.landingPageContainer.style.display="none";
                        domItems.quizContainer.style.display="block";
                        console.log(currPerson);
                    }
                    else{
                        alert("quiz is not ready please contact to administrator");
                    }
                }
                else{
                    domItems.landingPageContainer.style.display="none";
                    domItems.adminPageContainer.style.display="block";
                }
            }
            else{
                alert("please enter your firstname and lastname");
            }
        },
        finalResult:function(currPerson){
            domItems.finalScoreText.textContent=currPerson.fullname[0]+' '+currPerson.fullname[1]+',your final score is'+currPerson.score;
            domItems.quizContainer.style.display="none";
            domItems.finalResultContainer.style.display="block";
        },
        addResultOnPanel:function(userData){
            var resultHTML;
            domItems.resultsListWrapper.innerHTML='';
            for(var i=0;i<userData.getPersonData().length;i++)
            {
                resultHTML='<p class="person person-'+i+'"><span class="person-'+i+'">'+ userData.getPersonData()[i].fname+''+ userData.getPersonData()[i].lname+''+userData.getPersonData()[i].score+' points</span><button id="delete-result-btn_'+userData.getPersonData()[i].id+'" class="delete_result_btn">Delete</button></p>';
                domItems.resultsListWrapper.insertAdjacentHTML('afterbegin',resultHTML);
            }
        },
        deleteResult:function(event,userData){
            var getId,personsArr;
            personsArr=userData.getPersonData();
            if('delete-result-btn_'.indexOf(event.target.id))
            {
                getId=parseInt(event.target.id.split('_')[1]);
                for(var i=0;i<personsArr.length;i++)
                {
                    if(personsArr[i].id===getId)
                    {
                        personsArr.splice(i,1);
                        userData.setPersonData(personsArr);
                    }
                }
            }
        },
        clearResultList:function(userData){
            var conf;
            if(userData.getPersonData()!==null){
                if(userData.getPersonData().length>0){
                    conf=confirm('Warning, You will loose entire result list');
                    if(conf)
                    {
                        userData.removePersonData();
                        domItems.resultsListWrapper.innerHTML='';
                    }
                }
               
            }
           
            
        }

     };
})();
// Controller
var controller=(function(quizCtrl,UICtrl){
    
    var selectedDomItems=UICtrl.getDomItems;
    UICtrl.addInputDynamically();
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    selectedDomItems.questInsertBtn.addEventListener('click',function(){
        var adminOptions=document.querySelectorAll('.admin-option');
        var checkBoolean=quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText,adminOptions);
        if(checkBoolean)
        {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }
    });
    selectedDomItems.insertedQuestionsWrapper.addEventListener('click',function(e){
        UICtrl.editQuestList(e,quizCtrl.getQuestionLocalStorage,UICtrl.addInputDynamically,UICtrl.createQuestionList);
        
    });
    selectedDomItems.questionClearBtn.addEventListener('click',function(e){
        UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
    });
    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);
    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);
    selectedDomItems.quizOptionsWrapper.addEventListener('click',function(e){
        var updatedOptionsDiv=selectedDomItems.quizOptionsWrapper.querySelectorAll('div');
        for(var i=0;i<updatedOptionsDiv.length;i++)
        {
            if(e.target.className==='choice-'+i)
            {
                // console.log(e.target.className);
                var yourAnswer=document.querySelector('.quiz-options-wrapper div p.'+e.target.className);
                var actualAnswer=quizCtrl.checkAnswer(yourAnswer);
                UICtrl.newDesign(actualAnswer,yourAnswer);
                if(quizCtrl.isFinished())
                {
                    selectedDomItems.nextQuestionBtn.textContent="finish";
                }
                var nextQuestion=function(questionData,progress){
                    if(quizCtrl.isFinished()){
                        //finished Quiz
                        quizCtrl.addPerson();
                        UICtrl.finalResult(quizCtrl.getCurrPersonData);
                    }
                    else{
                        UICtrl.resetDesign();
                        quizCtrl.getQuizProgress.questionIndex++;
                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);
                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);
    
    
                    }
                }
                selectedDomItems.nextQuestionBtn.onclick=function(){
                    nextQuestion(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);
                }
            }
        }
    });
    selectedDomItems.startQuizBtn.addEventListener('click',function(){
        UICtrl.getFullName(quizCtrl.getCurrPersonData,quizCtrl.getQuestionLocalStorage,quizCtrl.getAdminFullName);
    });
    selectedDomItems.lname.addEventListener('focus',function(){
        selectedDomItems.lname.addEventListener('keypress',function(e){
            if(e.keyCode===13)
            {
                UICtrl.getFullName(quizCtrl.getCurrPersonData,quizCtrl.getQuestionLocalStorage,quizCtrl.getAdminFullName);
            }
        });
    });
    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    selectedDomItems.resultsListWrapper.addEventListener('click',function(e){
        UICtrl.deleteResult(e,quizCtrl.getPersonLocalStorage);
        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    });
    selectedDomItems.resultsClearBtn.addEventListener('click',function(){
        UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);
    });
})(quizController,UIController);