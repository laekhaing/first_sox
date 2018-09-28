'use strict'

const Redis = use('Redis')
const AudioConvert = use('App/Models/Util/AudioConvert')
const AudioData = use('App/Models/AudioData')
const Ws = use('Ws')

Redis.subscribe('audio-convert', async id => {
  let status = '変換完了'
  try {
    await AudioConvert.convert(id)
  } catch (e) {
    const audioData = await AudioData.find(id)
    audioData.status = 9
    await audioData.save()
    status = '失敗'
  }

  const topic = Ws.getChannel('file-status:*').topic('file-status:checker')
  if (topic) {
    await topic.broadcast('message', JSON.stringify({
      id: id,
      status: status
    }))
  }
})
