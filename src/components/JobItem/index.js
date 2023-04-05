import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {IoLocation} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {job} = props
  const {
    id,
    title,
    rating,
    location,
    jobDescription,
    employmentType,
    companyLogoUrl,
    packagePerAnnum,
  } = job

  return (
    <Link to={`/jobs/${id}`} className="link-item-job">
      <li className="job-item">
        <div className="logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="remain-details-container">
          <div className="location-type-container">
            <div className="location-container">
              <IoLocation className="location-icon" />
              <p className="location-text">{location}</p>
            </div>
            <div className="location-container">
              <BsBriefcaseFill className="location-icon" />
              <p className="location-text">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr className="horizontal-line" />
        <h1 className="description-head">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
