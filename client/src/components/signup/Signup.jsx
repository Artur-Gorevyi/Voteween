import React, { useState } from 'react'
import classes from './signup.module.css'
import img from '../../assets/woman2.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { register } from 'timeago.js'
import { useDispatch } from 'react-redux'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignup = async(e) => {
    e.preventDefault()

    if(username === '' || email === '' || password === '') return

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({username, email, password})
      })
      
      const data = await res.json()
      dispatch(register(data))
      navigate('/')
    } catch (error) {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3000)
    }
  }

  return (
    <div className={classes.signUpContainer}>
      <div className={classes.signUpWrapper}>
        <div className={classes.signUpLeftSide}>
          <img src={img} className={classes.leftImg} />
        </div>
        <div className={classes.signUpRightSide}>
          <h2 className={classes.title}>Sigh Up</h2>
          <form onSubmit={handleSignup} className={classes.signUpForm}>
            <input type="text" placeholder='Username' />
            <input type="email" placeholder='Email' />
            <input type="passwrd" placeholder='Password' />
            <button type='submit' className={classes.submitBtn}>Sign Up</button>
            <p>Already have an account? <Link to='/login'>Login</Link></p>
          </form>
          {
            error && (
              <div className={classes.errorMessage}>
                Wrong data
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Signup