'use strict'

const Model = use('Model')
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async userInstance => {
      userInstance.password = await Hash.make(userInstance.password)
    })
  }

  audioData () {
    return this.hasMany('App/Models/AudioData')
  }
}

module.exports = User
