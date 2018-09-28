'use strict'

const Schema = use('Schema')

class AudioDataSchema extends Schema {
  up () {
    this.table('audio_data', (table) => {
      table.bigInteger('file_size')
      table.bigInteger('file_duration')
    })
  }

  down () {
    this.table('audio_data', (table) => {
      table.dropCoulmn('file_size')
      table.dropCoulmn('file_duration')
    })
  }
}

module.exports = AudioDataSchema
