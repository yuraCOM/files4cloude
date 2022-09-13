const fs = require('fs')
const File = require('../models/File')
const config = require('config')


class FileService {

    createDir(req, file) {
        const filePath = this.getPath(req, file)
        return new Promise(((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({ message: 'File was created' })
                } else {
                    return reject({ message: "File already exist" })
                }
            } catch (e) {
                return reject({ message: 'File error' })
            }
        }))
    };

    deleteFile(req, file) {
        console.log(file);
        const path = this.getPath(req, file)
        if (file.type === 'dir') {
            fs.rmdirSync(path)
        } else {
            fs.unlinkSync(path)
        }
    }

    getPath(req, file) {
        return req.filePath + '\\' + file.user + '\\' + file.path

    }

    //random
    str_randLen(long) {
        var result = '';
        // var words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        var words = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
        var max_position = words.length - 1;
        for (let i = 0; i < long; ++i) {
            let position = Math.floor(Math.random() * max_position);
            result = result + words.substring(position, position + 1);
        }
        return result;
    }
}

module.exports = new FileService()

