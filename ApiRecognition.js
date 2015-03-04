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
  this.lang = lang || 'en-US';

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

RecognitionAPI.prototype.textToVoice = function(options, callback, errorCallback){

  if(!options.text || options.text.trim() ==""){
    errorCallback("No text to read");
    return;
  }

  var synthesis = new SpeechSynthesisUtterance();
  synthesis.lang = options.lang || 'en-US';
  synthesis.rate = options.rate || 1.2;
  synthesis.text = options.text;

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
    text = options.text;

    //callback function that will return the result from the Google API

    callback = function(reply){
      if(reply.error){
        errorCallback(reply.error.message)
      }
      else{
        if(response.data)
        successCallback(response.data.translations[0].translatedText);
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
    callback = function(reply){
      if(reply.error){
        errorCallback(reply.error.message)
      }
      else{
        successCallback(reply.text_converted);
      }
    };

    loadURL(options.urlApi);
  }

}


RecognitionAPI.prototype.translateTextToVoice = function(apiOptions, voiceOptions, errorCallback){

  var that = this;
  successCallback = function(reply){
    voiceOptions.text = reply.result;
    that.textToVoice(voiceOptions, function(){}, function(){});
  };

  this.translate(apiOptions, successCallback);
}

/*RecognitionAPI.prototype.translateVoiceToText = function(apiOptions, successCallback, errorCallback){

  var that = this;

  that.translate(apiOptions, function(text){
    that.voiceToText(function(text){
      successCallback(text);
    });
  },function(error){
    errorCallback(error);
  });

}

RecognitionAPI.prototype.translateVoiceToVoice = function(translateOptions, voiceOptions, successCallback, errorCallback){
  var that = this;
  that.voiceToText(function(text){
    that.translate(translateOptions, function(text){
      that.textToVoice(voiceOptions, function(){
        successCallback();
      },
      function(error){
        errorCallback(error);
      });
    },function(error){
      errorCallback(error);
    });
  });
}*/
