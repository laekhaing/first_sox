### GOOGLE_APPLICATION_CREDENTIALS
If you access `google-speech-api`, you should be register `GOOGLE_APPLICATION_CREDENTIALS` with environment variable.  
You can see document in this page `https://cloud.google.com/video-intelligence/docs/common/auth`.

### How to start sox-prj

```bash
# 1. This application (hereinafter, this is called "simpleApp") require 'adonis-cli'. If you have not installed 'adonis-cli', please install it.
npm i -g @adonisjs/cli

# 2. simpleApp use 'pub-sub', it work on 'Redis'. If you have not installed 'Redis', please install it.
# - Goto: https://github.com/MicrosoftArchive/redis/releases
# - Download: Redis-x64-xxxx.zip
# - Start redis: Click redis-server.exe in redis directory 

# 3. Clone this repository.
git clone git@gitlab.com:ntidevelop/bs/voice2text/simple-app.git
cd simple-app

# 4. yarn or npm install
yarn

# 5. Create database for simple-app
adonis migration:run
# ok, if database created, you can see 'adonis.sqlite' in 'database/'.

# 6. Create sample user
adonis create:user
# > ログインIDを入力してください
# write sample user's login_id.
# > パスワードを入力してください
# write sample user's password.

# 7. Start simpleApp
adonis serve:dev
```
