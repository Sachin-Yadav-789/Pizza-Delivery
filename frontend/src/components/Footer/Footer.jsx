import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
       <div className="footer-content">
          <div className='footer-content-left'>
              <img src={assets.logoPizza} className='logo' alt="" />
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab similique autem dolorem provident. Temporibus nostrum necessitatibus nemo sequi, maxime rerum delectus molestias neque suscipit asperiores quibusdam rem? Architecto, natus autem?</p>
              <div className="footer-social-icons">
                 <img src={assets.facebook_icon} alt="" />
                 <img src={assets.twitter_icon} alt="" />
                 <img src={assets.linkedin_icon} alt="" />
              </div>
          </div>
          <div className='footer-content-center'>
              <h2>COMPANY</h2>
              <ul>
                 <li>Home</li>
                 <li>About us</li>
                 <li>Delivery</li>
                <li>Privacy policy</li>
              </ul>
            </div>
          <div className='footer-content-right'>
               <h2>GET IN TOUCH</h2>
               <ul>
                  <li>+1-212-456-2344</li>
                  <li>contact@pizza.com</li>
               </ul>
          </div>
       </div>
        <hr />
        <p className="footer-copyright">copy right 2026 © Pizza.com -All Right Reserved.</p>
    </div>
  )
}

export default Footer
