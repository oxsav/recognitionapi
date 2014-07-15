/**
 * RecognitionAPI
 *
 * @param recognition  
 * @param continuous 
 * @param interimResults 
 * @param lang 
 *
 */
function RecognitionAPI(){

  this.recognition;
  this.continuous;
  this.interimResults;
  this.lang;


  /** loadURL 
   *  this method will do a HTTP GET to a external URL (a callback must be defined in the URL)
   * @param url String
   */
  loadURL = function(url){
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", url);
    if (typeof fileref != "undefined")
      document.getElementsByTagName("head")[0].appendChild(fileref);  
  };

}


RecognitionAPI.prototype.start = function(continuous, iterim, lang){  

  this.recognition = new webkitSpeechRecognition();
  this.recognition.continuous = continuous;
  this.recognition.interimResults = iterim;
  this.lang = lang;

  this.recognition.start();

}


RecognitionAPI.prototype.stop = function(evt, callback){

  this.recognition.stop(); 

}


RecognitionAPI.prototype.onresult = function(callback){

  this.recognition.onresult = function(event){
    callback(event);
  };
  
}

RecognitionAPI.prototype.onstart = function(callback){

  this.recognition.onstart = function(){

    callback();

  };

}

RecognitionAPI.prototype.onend = function(callback){

  this.recognition.onend = function(evt){
    callback(evt);
  };

}


RecognitionAPI.prototype.onerror = function(callback){

  this.recognition.onerror = function(error){
    callback(error); 
  };

}

RecognitionAPI.prototype.onnomatch = function(callback){

  this.recognition.onnomatch = callback;

}

RecognitionAPI.prototype.onsoundend = function(callback){

  this.recognition.onsoundend = function(event){
    callback(event);
  };
  
}


RecognitionAPI.prototype.voiceToText = function(callback){

  this.onresult(function(event){
    var text = '';
    if (event.results && event.results.length){
      for ( var i = event.resultIndex, len = event.results.length; i < len; ++i ){
        text += event.results[i][0].transcript;
      }
      callback(text);
    }
  });
  
}

RecognitionAPI.prototype.textToVoice = function(text, lang, rate, callback, errorCallback){
  
  if(!text || text==""){
    errorCallback("No text to read");
    return;
  }
    

  var synthesis = new SpeechSynthesisUtterance();
  synthesis.lang = lang || 'en-US';
  synthesis.rate = rate || 1.2;
  synthesis.text = text;

  speechSynthesis.speak(synthesis);
  synthesis.onend = function(evt){ callback(evt); }
}

/** translate function
 * 
 */

RecognitionAPI.prototype.translate = function(options, successCallback, errorCallback){
  
  /* for translate need to define wich API will be defined. 
  Define if we want to use HTTP to have the translation done, or if want to use some API like google or bing.
  Need to understand first the exitence APIs.*/
  var to;
  var from;
  var text;

  callback = function(reply){
      if(reply.error){
        errorCallback(reply.error.message)
      }
      else{
        successCallback(reply);  
      }
      
  };

  if(!options){
    errorCallback("No Api Defined");
    return;
  }


  if(options.apitype === 'googleapi'){

    if(!options.apikey){
      errorCallback("Missing API KEY");
      return
    }
    if(!options.text){
      errorCallback("Missing Text to translante");
      return
    }

    to = options.to || 'en-US';
    from = options.from || 'en-US';
    text = options.text || "";

    //callback function that will return the result from the Google API
    
    callback = function(reply){
      if(reply.error){
        errorCallback(reply.error.message)
      }
      else{
        successCallback(reply);  
      }
      
    };


    var url = 'https://www.googleapis.com/language/translate/v2?key=' + options.apikey + '&target=' + options.to + '&callback=callback&q='+ text;
    loadURL(url);
    

  }else if(options.apitype === 'bingapi'){

    successCallback("In development...");
    
    //appId = options.apikey

    if(!options.apikey){
      errorCallback("Missing API KEY");
      return
    }
    
    to = options.to || 'en-US';
    from = options.from || 'pt-PT';
    text = options.text;

    //http://api.microsofttranslator.com/v2/Http.svc/Translate?appId=123123&text=hello&from=en-US&to=pt-PT&callback=return 

  }
  else {
    if(!options.urlApi){
      errorCallback("Missing the URL!")
      return;
    }

    loadURL(options.urlApi);
  }
  
}