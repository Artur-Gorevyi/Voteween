import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
import man from '../../assets/man.jpg'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BiMessageRounded } from 'react-icons/bi'
import classes from './post.module.css'
import Comment from '../comment/Comment'
import { likePost } from '../../redux/authSlice'

const Post = ({ post }) => {
  const { user, token } = useSelector((state) => state.auth)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [isCommentEmpty, setIsCommentEmpty] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const dispatch = useDispatch()

  const [likedPhotoIndex, setLikedPhotoIndex] = useState(null);

  const [firstPhotoLikes, setFirstPhotoLikes] = useState(0);
  const [secondPhotoLikes, setSecondPhotoLikes] = useState(0);
  
  useEffect(() => {
    const initialLikedPhotoIndex = post.likes[user._id];
    setLikedPhotoIndex(initialLikedPhotoIndex);
  }, [post, user._id]);

  useEffect(() => {
    const likesArray = Object.values(post.likes);
    const firstPhotoLikes = likesArray.filter(like => like === 0).length;
    const secondPhotoLikes = likesArray.filter(like => like === 1).length;
    setFirstPhotoLikes(firstPhotoLikes);
    setSecondPhotoLikes(secondPhotoLikes);
  }, [post]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/comment/${post._id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        const data = await res.json()
        setComments(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchComments()
  }, [post._id])

  const deletePost = async () => {
    try {
      await fetch(`http://localhost:5000/post/${post._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: 'DELETE'
      })
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  const handleLikePost = async(photoIndex) => {
    try {
      const res = await fetch(`http://localhost:5000/post/like/${post._id}/${photoIndex}`, {
        headers: {
          "Authorization": `Bearer ${token}`
          
        },
        method: "PUT"
      })
      const updatedPost = await res.json();
      
      if (likedPhotoIndex != null) {
        // Change like photo
        if (likedPhotoIndex != photoIndex) {
          setLikedPhotoIndex(photoIndex)
          if (photoIndex == 0) {
            setFirstPhotoLikes(firstPhotoLikes + 1)
            setSecondPhotoLikes(secondPhotoLikes - 1)
          } else {
            setFirstPhotoLikes(firstPhotoLikes - 1)
            setSecondPhotoLikes(secondPhotoLikes + 1)
          }
        } 
        // Dislike
        else {
          setLikedPhotoIndex(null)
          if (photoIndex == 0) {
            setFirstPhotoLikes(firstPhotoLikes - 1);
          } else {
            setSecondPhotoLikes(secondPhotoLikes - 1);
          }
          dispatch(likePost(updatedPost))
        }
      } 
      // Like
      else {
        setLikedPhotoIndex(photoIndex)
        if (photoIndex == 0) {
          setFirstPhotoLikes(firstPhotoLikes + 1);
        } else {
          setSecondPhotoLikes(secondPhotoLikes + 1);
        }
        dispatch(likePost(updatedPost))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handlePostComment = async () => {
    if (commentText === '') {
      setIsCommentEmpty(true)
      setTimeout(() => {
        setIsCommentEmpty(false)
      }, 2000)
      return
    }

    try {
      const res = await fetch(`http://localhost:5000/comment`, {
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({ commentText, post: post._id })
      })

      const data = await res.json()

      setComments(prev => [...prev, data])
      setCommentText('')
    } catch (error) {
      console.error(error)
    }
  }

  
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.top}>
          <Link to={`/profileDetail/${post?.user?._id}`} className={classes.topLeft}>
            <img src={post?.user?.profileImg ? `http://localhost:5000/images/${post?.user?.profileImg}` : man} className={classes.profileUserImg} />
            <div className={classes.profileMetadata}>
              <span>{capitalizeFirstLetter(post.user.username)}</span>
              <span>{format(post.createdAt)}</span>
            </div>
          </Link>
          {
            (user._id === post.user._id) &&
            <HiOutlineDotsVertical size={25} onClick={() => setShowDeleteModal(prev => !prev)} />
          }
          {
            showDeleteModal && (
              <div className={classes.deleteModal}>
                <h3>Delete Post</h3>
                <div className={classes.buttons}>
                  <button onClick={deletePost}>Yes</button>
                  <button onClick={() => setShowDeleteModal(prev => !prev)}>No</button>
                </div>
              </div>
            )
          }
        </div>
        <div className={classes.center}>
          <div className={classes.desc}>{post.desc}</div>
          <div className={classes.postImgs}>
            <div className={classes.postImg}>
                <img src={post?.firstImg ? `http://localhost:5000/images/${post?.firstImg}` : ''} />
                <div className={classes.likeBtn}>
                {likedPhotoIndex === 0 ? <AiFillHeart onClick={() => handleLikePost(0)} /> : <AiOutlineHeart onClick={() => handleLikePost(0)} />}
                </div>
                <p>{firstPhotoLikes}</p>
            </div>
            <div className={classes.postImg}>
                <img src={post?.secondImg ? `http://localhost:5000/images/${post?.secondImg}` : ''} />
                <div className={classes.likeBtn}>
                {likedPhotoIndex === 1 ? <AiFillHeart onClick={() => handleLikePost(1)} /> : <AiOutlineHeart onClick={() => handleLikePost(1)} />}
                </div>
                <p>{secondPhotoLikes}</p>
            </div>
          </div>
        </div>
        <div className={`${classes.controls} ${showComment && classes.showComment}`}>
          <div className={classes.controlsLeft}>
            <BiMessageRounded onClick={() => setShowComment(prev => !prev)} />
          </div>
        </div>
        {
          showComment &&
          <>
            <div className={classes.comments}>
              {
                comments?.length > 0 ? comments.map((comment) => (
                  <Comment c={comment} key={comment._id} />
                )) : <span style={{ marginLeft: '12px', fontSize: '20px' }}>No comments</span>
              }
            </div>
            <div className={classes.postCommentSection}>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                type="text"
                className={classes.inputSection}
                placeholder='Type comment'
              />
              <button onClick={handlePostComment}>Post</button>
            </div>
            {isCommentEmpty && <span className={classes.emptyCommentMsg}>You can't post empty comment!</span>}
          </>
        }
      </div>
    </div>
  )
}

export default Post