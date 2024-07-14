const express = require('express')
const router = express.Router()

router.post('/user/login', (req, res) => {
    // метод всегда возвращает Code: 201 и статичный объект: { id: 1, mail: "test@mail.ru" }

    res.status(201)
    const user = { id: 1, mail: "test@mail.ru" }
    res.json(user)
})

module.exports = router