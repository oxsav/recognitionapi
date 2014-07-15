Recognition Library
==============================


###Description

This library allow users to test the [SpeechRecognition API] (https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html), in a easier way and use it in web applications. 

####Methods

######How to Initialize the Library?

```javascript
	var recogn = new RecognitionAPI();
```

* `start`. This method starts the voice recognition and asks you for permission to access to your micro.


```javascript
	
	var continuous = true; //by default is false (allows the api to )
	var iteram = true; //by default is false
	var lang = 'en-US'; //by default is en-US
	
	//executing start you are albe to speak to the computer
	recogn.start(continuous, iteramResults, lang);
  
	
```
* `stop`. Stops the recognition

```javascript

  recogn.stop();

```
* `events`. how to handle the events of the api

```javascript
  //on recognition start
  recogn.onstart(function(){
    console.log("Recognition Started!");
  });
  
  //on recognition end
  recogn.onend(function(event){
    console.log("Recognition ended!", event);
  });

  //when recognition gets an error
  recogn.onerror(function(error){
    console.log("Recognition error!", error);
  });
  
  //when recognition has no match word
  recogn.onnomatch(function(event){
    console.log("Recognition not matched!", event);
  });
  
  //on recognition end
  recogn.onsoundend(function(event){
    console.log("Recognition sound ended!", event);
  });

```

* `voiceToText`. This method recognize the words you say and present it as text

```javascript

  recogn.start(true,true,'en-US');
  
  rec.voiceToText(function(resultString){
    console.log("You said: ", resultString);
  });

```

* `textToVoice`. This method spells a text of your choice

```javascript
  var options = {
    text: "Hello World",
    lang: "en-Us", //default is en-US (language)
    rate 1.2 //default is 1.2 (velocity that you want to the text be spelled)
  };
  
  recogn.textToVoice(options, successCallback, errorCallback);
  
  successCallback = function(evt){};
  errorCallback = function(error){};

```

* `translate`. Translate a text from a language to another (this method can use google translator API or a method of your own if is running in a RestAPI, later will use bing Translator API)

```javascript

  //for google translator API
    
  var options = {
    apitype : 'googleapi', //mandatory
    apikey  : 'some-key-ur-using', //mandatory
    to      : 'language to return', //default is en-US
    from    : 'language to translate', //default is en-US
    text    : 'text to translate' //mandatory
  };
  
  
  recogn.translate(options, successCallback, errorCallback);
  
  successCallback = function(reply){ console.log(reply); }
  errorCallback = function(error){console.log(error);}
  
  //for one api of your own
  
  var options = {
    //make sure that you are using a callback in your RESTAPI
    urlApi  : 'http://localhost/appTranslate/translate.php?text=hello&from=en&to=pt&callback=callback' //mandatory
  };
  
  recogn.translate(options, successCallback, errorCallback);
  
  successCallback = function(reply){ console.log(reply); }
  errorCallback = function(error){console.log();}

```




