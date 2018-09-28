'use strict'

const Redis = use('Redis')

class FileStatusController {
  constructor ({ socket, request, auth }) {
    this.socket = socket
    this.request = request
    this.auth = auth
  }

  onMessage () {
    console.log(1)
    // same as: socket.on('message')
  }

  onClose () {
    console.log(2)
    // same as: socket.on('close')
  }

  onError () {
    console.log(3)
    // same as: socket.on('error')
  }

  async onSample () {
    this.auth.getUser().then(user => {
      console.log(user)
    })
  }

  sendTest () {
    console.log(sendTest)
  }
}

module.exports = FileStatusController
