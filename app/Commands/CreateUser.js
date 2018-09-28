'use strict'

const { Command } = require('@adonisjs/ace')
const Database = use('Database')
const User = use('App/Models/User')

class CreateUser extends Command {
  static get signature () {
    return 'create:user'
  }

  static get description () {
    return 'Tell something helpful about this command'
  }

  async handle (args, options) {
    const loginId = await this.ask('ログインIDを入力してください')
    const password = await this.ask('パスワードを入力してください')

    if (!loginId || !password) {
      this.error('ログインIDまたはパスワードが空です')
      return
    }

    const existUser = await User.findBy('login_id', loginId)
    if (existUser) {
      this.error('すでに存在するログインIDです')
      Database.close()
      return
    }

    const user = new User()
    user.login_id = loginId
    user.password = password
    await user.save()

    this.success(`ユーザーを作成しました ID=${loginId} Password=${password}`)
    Database.close()
  }
}

module.exports = CreateUser
