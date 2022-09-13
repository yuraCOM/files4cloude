import React from 'react'
import './file.css'
import dirLogo from '../../../../assets/img/dir.png'
import fileLogo from '../../../../assets/img/file.png'
import { useDispatch, useSelector } from 'react-redux'
import { pushToNameDirStack, pushToStack, setCurrentDir } from '../../../../reducers/fileReducer'
import { deleteFile, downloadFile } from '../../../../actions/fileAction'
import sizeFormat from '../../../../utils/sizeFormat'
import { auth } from '../../../../actions/user'


const File = ({ file }) => {

    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const fileView = useSelector(state => state.files.view)

    function openDirHandler(file) {
        if (file.type === 'dir') {
            dispatch(pushToStack(currentDir))
            dispatch(pushToNameDirStack(file.name))
            dispatch(setCurrentDir(file._id))
        }
    }

    function downloadClickHandler(e) {
        e.stopPropagation()
        downloadFile(file)
    }

    async function delClickHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        await dispatch(deleteFile(file))
        await dispatch(auth())

    }

    if (fileView === 'list') {
        return (
            <div className='file' onClick={() => openDirHandler(file)}>
                <img src={file.type === 'dir' ? dirLogo : fileLogo} alt="" className="file__img" />
                <div className="file__name">{file.name}</div>
                <div className="file__date">{file.date.slice(0, 10)}</div>

                <div className="file__size">{file.type !== 'dir' ? sizeFormat(file.size) : 'dir'}</div>
                {/* <div className="file__size">{sizeFormat(file.size)}</div> */}
                {file.type !== 'dir' && <button onClick={(e) => downloadClickHandler(e)} className="file__btn file__download"></button>}
                <button className="file__btn file__delete" onClick={(e) => delClickHandler(e)}></button>

            </div>
        )
    }

    if (fileView === 'plate') {
        return (
            <div className='file-plate' onClick={() => openDirHandler(file)}>
                <img src={file.type === 'dir' ? dirLogo : fileLogo} alt="" className="file-plate__img" />
                <div className="file-plate__name">{file.name}</div>
                <div className="file-plate__btns">
                    {file.type !== 'dir' &&
                        <button onClick={(e) => downloadClickHandler(e)} className="file-plate__btn file-plate__download">download</button>}
                    <button
                        onClick={(e) => delClickHandler(e)}
                        className="file-plate__btn file-plate__delete">delete</button>
                </div>
            </div>
        );
    }


}

export default File





