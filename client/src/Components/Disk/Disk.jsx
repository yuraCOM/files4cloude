import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFiles, uploadFile } from '../../actions/fileAction'
import { auth } from '../../actions/user'
import { setCurrentDir, setFileView, setNameDirStack, setPopupDisplay } from '../../reducers/fileReducer'
import './diskStyle.css'
import FileList from './fileList/FileList'
import PopUp from './PopUp'
import Uploader from './uploader/Uploader'

const Disk = () => {

    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const loader = useSelector(state => state.app.loader)
    const dirStack = useSelector(state => state.files.dirStack)
    const dirNameStack = useSelector(state => state.files.dirNameStack)


    const [dragEnter, setDragEnter] = useState(false)
    const [sort, setSort] = useState('type')

    useEffect(() => {
        dispatch(getFiles(currentDir, sort))
        dispatch(auth())
    }, [currentDir, sort])

    function backClickHandler() {
        const backDirId = dirStack.pop()
        dispatch(setCurrentDir(backDirId))

        const updateDirNameStack = dirNameStack
        updateDirNameStack.pop()
        dispatch(setNameDirStack(updateDirNameStack))
    }

    function fileUploadHandler(event) {
        const files = [...event.target.files]
        files.forEach(async file => {
            await dispatch(uploadFile(file, currentDir))
            await dispatch(auth())
            // await setX(x => x + 1)
        })
    }

    function dragEnterHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(true)

    }

    function dragLeaveHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(false)
    }

    function dropHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        let files = [...event.dataTransfer.files]
        files.forEach(file => dispatch(uploadFile(file, currentDir)))
        setDragEnter(false)
    }

    function showPopupHandler(event) {
        dispatch(setPopupDisplay('flex'))
    }

    if (loader) {
        return (
            <div className="loader">
                <h4>Loading........</h4>
                <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return (
        !dragEnter ?
            <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                <div className="disk__btns">
                    {dirStack.length ? <button className="disk__back"
                        onClick={() => backClickHandler()}>Назад</button> : false}
                    {/* <button className="disk__back" onClick={() => backClickHandler()}>Назад</button> */}
                    <button className="disk__create" onClick={() => showPopupHandler()}>Создать папку</button>
                    <div className="disk__upload">
                        <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл</label>
                        <input multiple={false} onChange={(event) => fileUploadHandler(event)} type="file" id="disk__upload-input" className="disk__upload-input" />
                    </div>
                    <select value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className='disk__select'>
                        <option value="name">По имени</option>
                        <option value="type">По типу</option>
                        <option value="date">По дате</option>
                    </select>
                    <button className="disk__plate" onClick={() => dispatch(setFileView('plate'))} />
                    <button className="disk__list" onClick={() => dispatch(setFileView('list'))} />

                </div>
                <FileList />
                <PopUp />
                <Uploader />

            </div>
            :
            <div className="drop-area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                Перетащите файлы сюда
            </div>
    )
}

export default Disk

