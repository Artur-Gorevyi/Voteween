import React from 'react'
import classes from './navbar.module.css'
import { Link } from 'react-router-dom'
import man from '../../assets/man.jpg'
import { AiOutlineLogout, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai'

const Navbar = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <Link to='/'>
            Artur Gorevyi
          </Link>
        </div>
        <div className={classes.center}>
          <input type="text" placeholder='Search user...' />
          <AiOutlineSearch className={classes.searchIcon} />
        </div>
        <div className={classes.right}>
          <Link to='/upload' style={{textDecoration: 'none', color: 'inherit'}}>
            Upload
          </Link>
          <div className={classes.icons}>
            <AiOutlineUser />
            <AiOutlineLogout />
          </div>
          <img src={man} className={classes.profileUserImg} />
        </div>
      </div>
    </div>
  )
}

export default Navbar