// @ts-nocheck
import React from 'react'
import classes from './profileCard.module.css'
import man from '../../assets/man.jpg'
import { capitalizeFirstLetter } from 'util/capitalizeFirstLetter'
import { Link } from 'react-router-dom'

const ProfileCard = () => {

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.top}>
          <div className={classes.imgContainer}>
            <img src={man} className={classes.profileUserImg} />
          </div>
          <div className={classes.usernameAndCreatedAt}>
            <p><span>Username:</span> {capitalizeFirstLetter('user')}</p>
            <p><span>Created At:</span> 12-12-2024</p>
          </div>
        </div>
        <hr />
        <div className={classes.bottom}>
          <p>Followers: <span>123</span></p>
          <p>Followings: <span>1263</span></p>
        </div>
      </div>
        <Link style={{textDecoration: 'none'}} to='/'>
          <h3 className={classes.myProfile}>My Profile</h3>
        </Link>
    </div>
  )
}

export default ProfileCard