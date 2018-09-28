'use strict'

const Helpers = use('Helpers')
const speech = require('@google-cloud/speech')
const fs = require('fs')

class HomeController {
  async index ({ view }) {
    return view.render('index')
  }

  /**
   * @param request {Request}
   * @param response
   * @param session
   * @return {Promise<*|Response>}
   */
  async postData ({ request, response, session }) {
    const file = request.file('audio', {
      types: ['audio'],
      size: '5mb'
    })

    await file.move(Helpers.tmpPath('uploads'), {
      name: file.clientName
    })

    if (!file.moved()) {
      return file.error()
    }

    if (file.subtype === 'wav') {
      try {
        const data = await this.getText(file.clientName)
        session.flash({
          text: data
        })
      } catch (e) {
        return response.redirect('/')
      }
    }

    return response.redirect('/')
  }

  getText (name) {
    return new Promise(function (resolve, reject) {
      const client = new speech.SpeechClient();
      const fileName = Helpers.tmpPath('uploads') + '/' + name;
      const file = fs.readFileSync(fileName);
      const audioBytes = file.toString('base64');
      const audio = {
        content: audioBytes,
      };
      const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'ja-JP',
      };
      const request = {
        audio: audio,
        config: config,
      };
      client
        .recognize(request)
        .then(data => {
          const response = data[0];
          const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

          resolve(transcription)
        })
        .catch(err => {
          console.error('ERROR:', err);
          reject(err)
        });
    })
  }
}

module.exports = HomeController
