'use strict'

const Schema = use('Schema')

class AudioDataSchema extends Schema {
  up () {
    this.create('audio_data', (table) => {
      table.increments()
      table.integer('user_id').index().references('id').inTable('users').onDelete('CASCADE')
      table.string('name').notNullable()
      table.integer('language').notNullable()
      table.integer('status').notNullable().defaultTo(0) // 0: 未変換, 2: 変換中　1:変換完了: 9: 変換失敗
      table.string('original_name').notNullable() // 変換する前のファイル名
      table.string('mime_type').notNullable() // ダウンロードする用 i.e) audio/wav
      table.string('file_name').notNullable() // xxxxx.wav | xxxx.flac
      table.text('result')
      table.timestamps()
    })
  }

  down () {
    this.drop('audio_data')
  }
}

module.exports = AudioDataSchema
