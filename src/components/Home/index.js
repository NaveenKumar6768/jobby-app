import {Component} from 'react'
import {Link} from 'react-router-dom'

import Headers from '../Headers'

import './index.css'

class Home extends Component {
  render() {
    return (
      <div className="bg-container-home">
        <Headers />
        <div className="home-content-container">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-text">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs" className="link-item">
            <button type="button" className="find-btn">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home
