var
  INDEX = require('../index.js'),
  mongo = INDEX.mongo,
  date = new Date(),
  day = date.getDate(),
  month = date.getMonth() + 1,
  year = date.getFullYear(),
  dateString = [day, month, year].join('/'),
  hour = date.getHours().toString(),
  minute = date.getMinutes().toString(),
  seconds = date.getSeconds().toString()

if (hour < 10) hour = '0' + hour
if (minute < 10) minute = '0' + minute
if (seconds < 10) seconds = '0' + seconds

const hours = [hour, minute, seconds].join(':')
const timestamp = dateString + ' ' + hours

const query = {
  _id: '59bc2fcd3d63679b77fe6c9d'
}

mongo.models.locals.findOne(query)
  .then(res => {
    res.name = 'Mudei'
    return res.save()
  })
  .then(res => console.log('Notícia foi editada com sucesso'))
  .catch(e => console.log(e))
