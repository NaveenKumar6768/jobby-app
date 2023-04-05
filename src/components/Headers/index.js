import {withRouter, Link} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcaseFill} from 'react-icons/bs'

import Cookies from 'js-cookie'

import './index.css'

const Headers = props => {
  const {history} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo-home"
        />
      </Link>
      <div className="sm-items">
        <ul className="sm-icons-container">
          <Link to="/">
            <li className="list-item">
              <AiFillHome className="icon" />
            </li>
          </Link>

          <Link to="/jobs">
            <li className="list-item">
              <BsBriefcaseFill className="icon" />
            </li>
          </Link>

          <li className="list-item">
            <button
              className="logout-btn"
              type="button"
              onClick={onClickLogout}
            >
              <FiLogOut className="icon" />
            </button>
          </li>
        </ul>
      </div>
      <ul className="lg-icons-container">
        <Link to="/" className="link-item">
          <li className="nav-text">Home</li>
        </Link>
        <Link to="/jobs" className="link-item">
          <li className="nav-text">Jobs</li>
        </Link>
      </ul>
      <button type="button" className="logout-btn-bg" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}
export default withRouter(Headers)
