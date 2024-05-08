import React from 'react'
import classes from './home.module.css'
import ProfileCard from 'components/profileCard/ProfileCard'
import SuggestedUsers from 'components/suggestedUsers/SuggestedUsers'
import Posts from 'components/posts/Posts'
import Rightside from 'components/rightside/Rightside'

const Home = () => {
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <ProfileCard />
        <SuggestedUsers />
      </div>
      <Posts />
      <Rightside/>
    </div>
  )
}

export default Home