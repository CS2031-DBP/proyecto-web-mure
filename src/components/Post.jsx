import React from 'react'
import MusicPost from './MusicPost'
import './postStyle.css'

const Post = ({post}) => {
  return (
    <div key={post.id} className='post'>
    <MusicPost albumTitle={post.albumTitle} songTitle={post.songTitle} />

    <p> {post.owner}</p>
    <p>{post.description}</p>    
  </div>
  )
}

export default Post