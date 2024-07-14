const express = require('express')

const router = express.Router()
module.exports = router

const fs = require('fs');
const path = require('path');

const stor = require('../storage/storage')
const cBook = require('../classes/cBook')

// 2. получить все книги
router.get('/books', (req, res) => {

    // получаем массив всех книг
    const {books} = stor
    //res.status(200)
    res.json(books)
}) 

// 3. получить книгу по ID
router.get('/books/:id', (req, res) => {

    // получаем объект книги, если запись не найдена, вернём Code: 404
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex( el => el.id === id)

    if (idx !== -1){
        //res.status(200)
        res.json(books[idx])
    }
    else{
        res.status(404)
        res.json("Книга не найдена")
    }
})

// 4. создать книгу
router.post('/books', (req, res) => {
    // создаём книгу и возвращаем её же вместе с присвоенным ID
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body
    const newBook = new cBook(title, description, authors, favorite, fileCover, fileName, fileBook)

    const {books} = stor
    books.push(newBook)
        
    res.status(201)
    res.json(newBook)
})

// 5. редактировать книгу по ID
router.put('/books/:id', (req, res) => {
    // редактируем объект книги, если запись не найдена, вернём Code: 404
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex( el => el.id === id)

    if (idx !== -1){

        const {title, description, authors, favorite, fileCover, fileName} = req.body
        books[idx].title       = title
        books[idx].description = description
        books[idx].authors     = authors
        books[idx].favorite    = favorite
        books[idx].fileCover   = fileCover
        books[idx].fileName    = fileName
 
        //res.status(200)
        res.json(books[idx])
    }
    else{
        res.status(404)
        res.json("Книга не найдена")
    }    
})

// 6. удалить книгу по ID
router.delete('/books/:id', (req, res) => {
    // удаляем книгу и возвращаем ответ: 'ok'
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex( el => el.id === id)

    if (idx !== -1){
        books.splice(idx, 1)
        //res.status(200)
        res.json("ok")
    }
    else{
        res.status(404)
        res.json("Книга не найдена") 
    }    
})   

// Скачать книгу
// router.get('/books/:id/download', (req, res) => {

//     const {id} = req.params
//     const fullname = `${__dirname}\\..\\public\\books\\${id}`
//     //res.json(fullname)

//     const fixpath = `D:\\Юра\\Работа\\Гринатом\\NodeJS\\007 - middleware\\ndjs-hometask-007-middleware\\public\\${id}`
//     res.json(fixpath)
//     //express.static(fixpath) // даем возможность пользователю скачать файл
// }) 

router.get('/books/:id/download', (req, res) => {

    const {books} = stor
    const {id} = req.params
    
    // Ищем книгу в хранилище по названию, которое передали через параметры
    // В хранилище книга должна иметь сответствующее название fileName
    const idx = books.findIndex( el => el.fileName === id)    
    
    if (idx == -1)
        return res.status(404).send('Книга не найдена')
    
    // Формируем путь до книги
    const filePath = path.resolve(__dirname, "..", books[idx].fileBook)

    // Проверка, существует ли файл
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) 
            return res.status(404).send('Файл не найден')

        // Отправка файла на скачивание
        res.download(filePath, err => {
            if (err)
                res.status(500).send('Ошибка при скачивании файла')
        })
    })
})