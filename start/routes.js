'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')

Route.any('/', 'HomeController.index')
Route.post('login', 'AuthController.login')


Route.group(() => {
  Route.any('/', 'Service/HomeController.index')
  Route.get('/logout', 'AuthController.logout')
  Route.post('/convert', 'Service/AudioController.convert')
  Route.get('/audio/:id/download', 'Service/AudioController.download')
  Route.get('/audio/:id/text_download', 'Service/AudioController.textDownload')
  Route.get('/audio/:id/delete', 'Service/AudioController.delete')
  Route.post('/trimAudio', 'Service/AudioController.trimAudio')
}).middleware('auth').prefix('service')
