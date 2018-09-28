'use strict'

const Model = use('Model')
const Helpers = use('Helpers')
const uuid = require('uuid/v4')
const fs = require('fs')
const getDuration = require('get-audio-duration')
const Audio = require('audio')
const ffprobe = require('ffprobe')
const ffprobeStatic = require('ffprobe-static')
const { execFile } = require('child_process')
class AudioData extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }

  /**
   * データ作成
   * @param userId
   * @param name
   * @param language
   * @param file
   * @return {Promise<void>}
   */
  static async create (userId, name, file) {
    const fileName = uuid() + '.' + file.subtype
    await file.move(Helpers.tmpPath('uploads'), {
      name: fileName
    })

    if (!file.moved()) {
      throw new Error('ファイルのアップロードに失敗しました')
    }

    let data = new AudioData()
    try{
      // file size
      const filepath = Helpers.tmpPath('uploads') + '/' + fileName;
      const stats = fs.statSync(filepath)
      var fileSizeInBytes = stats["size"]
      var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
      var fileSize = Math.round( fileSizeInMegabytes * 10 ) / 10

      var data_duration = 0
      await ffprobe(filepath, { path: ffprobeStatic.path }).then(function (info) {
        let duration = info.streams[0]['duration']
        data.file_duration =  Math.round( duration * 10 ) / 10
        data_duration = duration
      })
    } catch (e) {
      console.log(e)
    }

    try {
      data.user_id = userId
      data.name = name
      data.language = 'ja'
      data.mime_type = file.type + '/' + file.subtype
      data.original_name = file.clientName
      data.file_name = fileName
      data.file_size = fileSize
      await data.save()
    } catch (e) {
      fs.unlinkSync(Helpers.tmpPath('uploads') + '/' + fileName)
      throw e
    }

    return data
  }

  static async delete (userId, id) {
    const ad = await AudioData.query().where('user_id', userId).andWhere('id', id).first()
    try {
      await ad.delete()
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = AudioData
