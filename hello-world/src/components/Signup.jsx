import React from 'react'
import user from './user.png';
import finger from './finger.jpg';
import './Login.css';
function Signup() {
  return (
    <>
            <div className="containers">
                 <div className="cont">
                 <form action="">
                           <h1>
                             
                             Student Login
                                </h1>   
                                <div className="input"> 
                                
                                <input type="email"
                                     name="email"   
                                          placeholder='User Name' />
                                      <img  src={user} alt="" className='user'/>
                                     <br></br>
                                          <img  src={finger} alt="" className='finger'/>
                                     <input type="password" name="password" className='l' placeholder='Password'/>
                                     <div className='rem'>
                                          <input type='checkbox'id='chk' />
                                          <p>Remember Me</p>
                                         <a href='#'><p id='f'>Forgot Password?</p></a> 
                                     </div>
                                     <button id='button'>Login</button>
                         </div>
                           </form>
                 </div>
      </div>
    </>
  )
}

export default Signup
