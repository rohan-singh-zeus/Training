import React from 'react'
import './ribbon.scss'
import Upload from '../../assets/upload.jpg'
import Open from '../../assets/open.png'

const Ribbon = () => {
  return (
    <div className='ribbon'>
      <div className='rTitle'>
        <p>File</p>
        <p>Operations</p>
        <p>Crud</p>
        <p>Graph</p>
      </div>
      <div className='rOptions'>
        <div className='r-1'>
          <div className="curved"></div>
        </div>
        <div className='r-2'></div>
        <div className='r-3'>
          <div className='upload'>
            <img src={Upload} alt="" />
            <p>Upload</p>
          </div>
          <div className='open'>
            <img src={Open} alt="" />
            <p>Open</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ribbon