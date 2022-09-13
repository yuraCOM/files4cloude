import React from 'react'
import { useSelector } from 'react-redux'
import './fileList.css'
import File from './file/File'

import { CSSTransition, TransitionGroup } from "react-transition-group";


const FileList = () => {
    const files = useSelector(state => state.files.files)
    const fileView = useSelector(state => state.files.view)
    const dirNameStack = useSelector(state => state.files.dirNameStack)

    let way = <div className="file-list__path">
        <span className="file-list__path-title">Path: </span>
        <span className='way'>{dirNameStack.map(way => way + ' / ')}</span>
    </div>

    if (files.length === 0) {

        return (
            <div>
                {way}
                <div className='loader'>Файлы не найдены</div>
            </div>

        )
    }

    if (fileView === "plate") {
        return (
            <div>
                {way}
                <div className='fileplate'>

                    {files.map(file =>
                        <File key={file._id + Date.now()} file={file} />
                    )}
                </div>
            </div>

        )
    }

    if (fileView === 'list') {
        return (
            <div className='filelist'>
                {way}
                <div className="filelist__header">
                    <div className="filelist__type">Тип</div>
                    <div className="filelist__name">Название</div>
                    <div className="filelist__date">Дата</div>
                    <div className="filelist__size">Размер</div>
                </div>
                <TransitionGroup>
                    {files.map(file =>
                        <CSSTransition
                            key={file._id}
                            timeout={500}
                            classNames={'file'}
                            exit={false}
                        >
                            <File file={file} />
                        </CSSTransition>
                    )}
                </TransitionGroup>
            </div>
        )
    }

}

export default FileList



 // let arr = [
    //     { id: 1, name: 'Dir00', type: 'dir', size: '5gb', date: '23.08.2022' },
    //     { id: 2, name: 'Dir55', type: 'dir', size: '1gb', date: '21.08.2022' },
    //     { id: 3, name: 'Dir77', type: 'file', size: '2gb', date: '15.08.2022' },
    // ]
    // const files = arr.map(file => <File key={file.id} file={file} />)