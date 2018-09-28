'use strict'

const AudioData = use('App/Models/AudioData')
const Redis = use('Redis')
const Ws = use('Ws')

class HomeController {
  async index ({ view, auth }) {
    const user = await auth.getUser()
    let total = 0
    let totalSize = 0
    const audioList = await AudioData.query().where('user_id', user.id).fetch()
    for (let i = 0 ; i < audioList.rows.length; i++) {
      total = total + audioList.rows[i].file_size
      totalSize = Math.round( total * 10 ) / 10
    }


    return view.render('service/index', {
      audioList: audioList.rows,
      totalFileSize : totalSize
    })
  }
}

module.exports = HomeController
