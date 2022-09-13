const fileService = require('../services/fileService')
const User = require('../models/user')
const File = require('../models/File')
const config = require('config')
const fs = require('fs')


class FileController {
    async createDir(req, res) {
        try {
            const { name, type, parent } = req.body
            const file = new File({ name, type, parent, user: req.user.id })
            const parentFile = await File.findOne({ _id: parent })
            if (!parentFile) {
                file.path = name
                await fileService.createDir(req, file)
            } else {
                file.path = `${parentFile.path}/${file.name}`
                await fileService.createDir(req, file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }
            await file.save()
            return res.json(file)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async getFiles(req, res) {

        try {
            const { sort } = req.query

            let files
            switch (sort) {
                case 'name':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ name: 1 })

                    break
                case 'type':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ type: 1 })
                    break
                case 'date':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ date: 1 })
                    break

                default:
                    files = await File.find({ user: req.user.id, parent: req.query.parent })
                    break;
            }

            return res.json(files)

        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not get files" })
        }
    }

    async uploadFile(req, res) {
        try {

            //файл из запроса
            const file = req.files.file

            //родитель директория - ищем в базе по йади юзера из токена и по айди-дериктории которую передаем в теле запроса
            const parent = await File.findOne({ user: req.user.id, _id: req.body.parent })

            //получаем самого пользователеля - чтоб далее проверить его место на диске
            const user = await User.findOne({ _id: req.user.id })

            //проверяем место на диске у юзера
            if (user.usedSpace + file.size > user.diskSpace) {
                //єто условие нет места
                return res.status(400).json({ message: 'There no space on the disk' })
            }
            //если есть место - то обновляем инфу у юзера о его месте + размер файла
            user.usedSpace = user.usedSpace + file.size

            //путь куда сохраняем
            let path;

            //если есть родтель parent
            if (parent) {
                path = `${req.filePath}\\${user._id}\\${parent.path}\\${file.name}`
            } else {
                path = `${req.filePath}\\${user._id}\\${file.name}`
            }

            //fs.existsSync(path) - проверяем елси такой файл по такому пути
            if (fs.existsSync(path)) {
                return res.status(400).json({ message: 'File already exist' })
            }

            // file.mv(path) - перемещаем файл по ранее размещенному пути
            await file.mv(path)

            // поулчаем тип файла - расширение
            const type = await file.name.split('.').pop()

            let filePath = file.name
            if (parent) {
                filePath = parent.path + "\\" + file.name
            }

            //создаем модель файла - что будем передавать в базу
            const dbFile = await new File({
                name: file.name,
                type,
                size: file.size,
                path: filePath,
                parent: parent ? parent._id : null,
                user: user._id
            })

            //охранем в базе и обновлем юзера
            await dbFile.save()
            await user.save()

            res.json(dbFile)

        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Upload error" })
        }
    }

    //https://www.youtube.com/watch?v=LHFRwvnrgIU&list=PL6DxKON1uLOGd4E6kG6d5K-tsTFj-Deln&index=16
    async downloadFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id })
            const path = fileService.getPath(req, file)
            if (fs.existsSync(path)) {
                return res.download(path, file.name)
            }
            return res.status(400).json({ message: "Download error" })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Download error" })
        }
    };


    //https://www.youtube.com/watch?v=usU9H9Pa7W0&list=PL6DxKON1uLOGd4E6kG6d5K-tsTFj-Deln&index=18&ab_channel=UlbiTV
    async deleteFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id })

            if (!file) {
                return res.status(400).json({ message: 'file not found' })
            }

            //получаем самого пользователеля - чтоб далее проверить его место на диске
            const user = await User.findOne({ _id: req.user.id })
            //если есть место - то обновляем инфу у юзера о его месте + размер файла
            user.usedSpace = user.usedSpace - file.size
            await user.save()
            await fileService.deleteFile(req, file)
            await file.remove()
            return res.json({ message: 'File was deleted' })
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Dir is not empty' })
        }
    }

    //https://www.youtube.com/watch?v=77msU1gRLdw&list=PL6DxKON1uLOGd4E6kG6d5K-tsTFj-Deln&index=21
    //find file in mongo base 
    async searchFile(req, res) {
        try {
            const searchName = req.query.search

            let files = await File.find({ user: req.user.id })
            files = files.filter(file => file.name.includes(searchName))
            return res.json(files)
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Search error' })
        }

    }

    //https://www.youtube.com/watch?v=14eDoj62nVo&list=PL6DxKON1uLOGd4E6kG6d5K-tsTFj-Deln&index=23&ab_channel=UlbiTV
    async uploadAvatar(req, res) {
        try {
            const file = req.files.file
            const user = await User.findById(req.user.id)
            const avatarName = fileService.str_randLen(10) + ".jpg"
            file.mv(config.get('staticPath') + "/" + avatarName)
            user.avatar = avatarName
            await user.save()
            return res.json(user)
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Upload avatar error' })
        }
    }

    async deleteAvatar(req, res) {
        try {
            console.log('avatar');
            const user = await User.findById(req.user.id)
            fs.unlinkSync(config.get('staticPath') + "/" + user.avatar)
            user.avatar = null
            await user.save()
            return res.json(user)
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Delete avatar error' })
        }
    }

}

module.exports = new FileController()