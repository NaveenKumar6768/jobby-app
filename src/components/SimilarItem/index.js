import {AiFillStar} from 'react-icons/ai'
import {IoLocation} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarItem = props => {
  const {item} = props
  const {
    title,
    rating,
    location,
    jobDescription,
    employmentType,
    companyLogoUrl,
  } = item

  return (
    <div className="job-item">
      <div className="logo-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="description-head">Description</h1>
      <p className="job-description">{jobDescription}</p>
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
    </div>
  )
}

export default SimilarItem
