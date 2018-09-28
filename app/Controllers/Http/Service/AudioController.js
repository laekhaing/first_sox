'use strict'
const { validateAll } = use('Validator')
const AudioData = use('App/Models/AudioData')
const Redis = use('Redis')
const Helpers = use('Helpers')
const moment = require('moment')
var exec = require('exec')
const { execFile } = require('child_process')

class AudioController {
  async convert ({ request, response, session, auth }) {
    const user = await auth.getUser()

    // ------ validation ----
    const rules = {
      audio_name: 'required|max:100'
    }

    const validation = await validateAll(request.all(), rules, {
      'audio_name.required': '音声名は必須です',
      'audio_name.max': '音声名は100文字以内で入力してください'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages())
      console.log(validation.messages())
      return response.redirect('back')
    }

     const { audio_name } = request.all()

     // --------------------

    const file = request.file('audio', {
      types: ['audio'],
      size: '200mb'
    })

    try {
      const ad = await AudioData.create(user.id, audio_name, file)
    } catch (e) {
      session.flash({
        error_message: e.message
      })
      return response.redirect('back')
    }

    return response.redirect('/service')
  }

  async trimAudio ({ request, response, auth } ) {
    try {
      const { id, language } = request.all()
      const user = await auth.getUser()
      const ad = await AudioData.query().where('user_id', user.id).andWhere('id', id).first()
      if (ad) {
        ad.language = language
        ad.status = 2 // 変換中
        await ad.save()
      }
      const filepath = Helpers.tmpPath('uploads') + '/' + ad.file_name;
      console.log("Trimming ", filepath)
      var base_name = filepath.split('.')[0]
      console.log("base_name: ", base_name)
      // Command to execute:
      // sox in.wav out.wav silence 1 0.5 1% 1 0.1 1% : newfile : restart
      var options =  filepath + " " + base_name+'_.wav' + " silence 1 0.5 1% 1 0.1 1% : newfile : restart"
      options = options.split(' ');
      console.log("options: ", options)
      const child = execFile('sox', options, (error, stdout, stderr) => {
        if (error) {
         throw error;
       }
       console.log('Converting using gcp');
       Redis.publish('audio-convert',ad.id)
     });
      return response.redirect('back')
    } catch (e) {
      console.log(e)
      return response.redirect('back')
    }
  }

  async download ({ params, response, auth }) {
    const user = await auth.getUser()

    const ad = await AudioData.query().where('user_id', user.id).andWhere('id', params.id).first()

    if (ad) {
      return response.attachment(
        Helpers.tmpPath('uploads') + '/' + ad.file_name,
        ad.original_name
      )
    }
  }

  async delete ({ params, response, auth }) {
    const user = await auth.getUser()
    await AudioData.delete(user.id, params.id)
    return response.redirect('/service')
  }

  async textDownload ({ params, response, auth }) {
    const user = await auth.getUser()

    const ad = await AudioData.query().where('user_id', user.id).andWhere('id', params.id).first()

    if (ad) {
      response.header('Content-Type', 'text/plain; charset=utf-8')
      response.header('Content-Disposition', 'attachment; filename="' + moment().format('YYYYMMDDHHmmss') + '-' + ad.id + '.txt"')
      console.log('result from db', ad.result)
      response.send(ad.result || '')
    }
  }
}

module.exports = AudioController
