const
  INDEX = require('../index.js'),
  mongo = INDEX.mongo,
  date = new Date(),
  day = date.getDate(),
  month = date.getMonth() + 1,
  year = date.getFullYear(),
  dateString = [day, month, year].join('/'),
  hour = date.getHours().toString(),
  minute = date.getMinutes().toString()

if (hour < 10) hour = '0' + hour
if (minute < 10) minute = '0' + minute

const hours = [hour, minute].join(':')
const timestamp = dateString + ' ' + hours

const query = {
  title: 'Essa noticia vai ser editada'
}

mongo.models.fakenews.findOne(query)
  .then(res => {
    console.log(res)
    res.title = 'O Título foi editado em ' + timestamp
    return res.save()
  })
  .then(res => console.log('Notícia foi editada com sucesso'))
  .catch(e => console.log(e))
