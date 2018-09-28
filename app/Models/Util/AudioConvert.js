'use strict'

const AudioData = use('App/Models/AudioData')
const Helpers = use('Helpers')
const speech = require('@google-cloud/speech')
const fs = require('fs')
var exec = require('exec')
const { execFile } = require('child_process')

class AudioConvert {
  static async convert (id) {
    console.log("In convert_trim_gcp")
    const audioData = await AudioData.find(id)
    const user = await audioData.user().fetch()
    const client = new speech.SpeechClient();
    const fileName = Helpers.tmpPath('uploads') + '/' + audioData.file_name;
    console.log("fileName: ", fileName)
    var base_name = fileName.split('.')[0]
    console.log("base_name: ", base_name)
    var all_files = fs.readdirSync(Helpers.tmpPath('uploads'));
    var files = [];
    var name = base_name.substring(base_name.lastIndexOf('/') + 1) + "_"
    all_files.forEach(function(element) {
      if(element.includes(name)) {
        files.push(element)
      }
    });

    var result = ''
    console.log("About to iterate")
    for(var i = 0; i < files.length; ++i) {
      var currfile = files[i];
      var currPath = Helpers.tmpPath('uploads') + '/' + currfile;
      console.log("File to transcribe: ", currPath)

      const file = fs.readFileSync(currPath);
      const audioBytes = file.toString('base64');
      const audio = {
        content: audioBytes,
      };
      const config = {
        languageCode: this.getLanguage(audioData.language),
        enableWordTimeOffsets: true
      };
      const request = {
        audio: audio,
        config: config,
      };

      console.log("Start Transcribe")
      const res = await this._convert(client, request)
      result = result + res + " "
      console.log(" curr result: ", res)
    }
    console.log("full result: ", result)
    audioData.result = result
    audioData.status = 1
    await audioData.save()
  }

  static _convert (client, request) {
    var transcription = ''
    return new Promise(function (resolve, reject) {
      client
        .recognize(request)
        // .then(data => {
        //   console.log(JSON.stringify(data))
        //   const response = data[0];
        //   const transcription = response.results
        //     .map(result => result.alternatives[0].transcript)
        //     .join('\n')
        //
        //   resolve(transcription)
        // })
        .then(data => {
     const response = data[0];
     response.results.forEach(result => {
       console.log(`Transcription: ${result.alternatives[0].transcript}`);
       result.alternatives[0].words.forEach(wordInfo => {
         const startSecs =
           `${wordInfo.startTime.seconds}` +
           `.` +
           wordInfo.startTime.nanos / 100000000;
         const endSecs =
           `${wordInfo.endTime.seconds}` +
           `.` +
           wordInfo.endTime.nanos / 100000000;
           const word = `${wordInfo.word}`
         if (startSecs > 0.0 && endSecs < 5.0) {
           const word_combine = `${wordInfo.word}`
           console.log(word_combine)
         }
         transcription =transcription + ' ' +  word + '\t' + startSecs + 'secs - ' + endSecs + ' secs ' + '\n'
         console.log('transcription : ' , transcription)
       });
     });
     resolve (transcription)
   })
   .catch(err => {
     console.error('ERROR:', err);
   });
  })
}

  /**
   * 言語取得
   * @param lang
   * @return {string}
   */
  static getLanguage (lang) {
    let l = 'ja-JP'
    switch (lang) {
      case 'ja':
        l = 'ja-JP'
        break
      case 'en':
        l = 'en-US'
        break
    }

    return l
  }
}

module.exports = AudioConvert
