import axios from 'axios'
import { API_URL } from '../config';
import { hideLoader, showLoader } from '../reducers/appReducer';
import { addFile, deleteFileAction, setFiles } from "../reducers/fileReducer";
import { addUploadFile, changeUploadFile, showUploader } from '../reducers/uploadReducer';

export function getFiles(dirId, sort) {

    return async dispatch => {
        try {
            dispatch(showLoader())

            let url = `${API_URL}api/files`

            if (dirId) {
                url = `${API_URL}api/files?parent=${dirId}`
            }
            if (sort) {
                url = `${API_URL}api/files?sort=${sort}`
            }
            if (dirId && sort) {
                url = `${API_URL}api/files?parent=${dirId}&sort=${sort}`
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })

            dispatch(setFiles(response.data))

        } catch (e) {
            alert(e.response.data.message)
        }
        finally {
            dispatch(hideLoader())
        }
    }
}


export function createDir(dirId, name) {
    return async dispatch => {
        try {
            const response = await axios.post(`${API_URL}api/files`, {
                name,
                parent: dirId,
                type: 'dir'
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            dispatch(addFile(response.data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

// ----------------- upload File
export function uploadFile(file, dirId) {

    return async dispatch => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            if (dirId) {
                formData.append('parent', dirId)
            }

            const uploadFile = { name: file.name, progress: 0, id: Date.now() }
            await dispatch(showUploader())
            await dispatch(addUploadFile(uploadFile))

            const response = await axios.post(`${API_URL}api/files/upload`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },

                //отслеживаем прогресс загрузки
                onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    if (totalLength) {
                        uploadFile.progress = Math.round((progressEvent.loaded * 100) / totalLength)
                        dispatch(changeUploadFile(uploadFile))

                    }
                }
            });
            dispatch(addFile(await response.data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

//--------- download File
export async function downloadFile(file) {
    const response = await fetch(`${API_URL}api/files/download?id=${file._id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    if (response.status === 200) {
        //blob - подобный физ файлу объект
        //https://www.youtube.com/watch?v=LHFRwvnrgIU&list=PL6DxKON1uLOGd4E6kG6d5K-tsTFj-Deln&index=16
        // время 5.48
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        link.remove()
    }
}


//https://github.com/utimur/MERN-cloud-disk/blob/d9847859c4e4e9dd1e983ea6d1e7af94f155a57a/client/src/actions/file.js
//time 3.28
export function deleteFile(file) {
    return async dispatch => {
        try {
            const response = await axios.delete(`${API_URL}api/files?id=${file._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(deleteFileAction(file._id))
            alert(response.data.message)
        } catch (e) {
            alert(e?.response?.data?.message)
        }
    }
}

// search file
export function searchFiles(search) {

    return async dispatch => {
        try {
            const response = await axios.get(`${API_URL}api/files/search?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(setFiles(response.data))
        } catch (e) {

            alert(e?.response?.data?.message)
        } finally {
            dispatch(hideLoader())
        }
    }
}