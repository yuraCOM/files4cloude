const Router = require("express");
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')

const { check, validationResult } = require("express-validator")

const router = new Router()

router.post('/registration',
    [
        check('email', "Uncorrect email").isEmail(),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({ min: 3, max: 12 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            console.log(errors);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Uncorrect request", errors })
            }

            const { email, password } = req.body;
            //пробегаем по базе - ищем такой емайл - если есть
            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({ message: `User with email ${email} already exist` })
            }

            //создаем нового
            // bcryptjs - спрятать пароль
            const hashPassword = await bcrypt.hash(password, 7)
            const user = new User({ email, password: hashPassword })
            await user.save()
            await fileService.createDir(req, new File({ user: user.id, name: '' }))
            return res.json({ message: "User was created" })

        } catch (error) {
            res.send({ message: "Server error" })
        }
    })


router.post('/login',

    async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            // сравниваем пароль в базе - использую дешифровку
            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({ message: "Invalid password" })
            }

            //npm i jsonwebtoken
            const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "1h" })
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })

        } catch (error) {
            res.send({ message: "Server error" })
        }
    })


router.get('/auth', authMiddleware,

    async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.user.id })
            const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "1h" })
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })


        } catch (error) {
            console.log(error)

            res.send({ message: "Server error" })
        }
    })



module.exports = router





    // lesson
    // https://www.youtube.com/watch?v=tPpvz-DIG0w&list=PL6DxKON1uLOGd4E6kG6d5K-tsTFj-Deln&index=4&ab_channel=UlbiTV
// провалидировать данные которые отправляются на сервер - есл вдруг - пустой пароль или не
// валидный емайл - установим npm i express-validator