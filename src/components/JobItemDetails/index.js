import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {IoLocation} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import SimilarItem from '../SimilarItem'
import Headers from '../Headers'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  initial: 'INITIAL',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarItemsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const job = data.job_details
      const updatedJobsData = {
        id: job.id,
        title: job.title,
        skills: job.skills.map(each => ({
          name: each.name,
          imageUrl: each.image_url,
        })),
        lifeAtCompany: {
          description: job.life_at_company.description,
          imageUrl: job.life_at_company.image_url,
        },
        companyWebsiteUrl: job.company_website_url,
        rating: job.rating,
        jobDescription: job.job_description,
        location: job.location,
        employmentType: job.employment_type,
        companyLogoUrl: job.company_logo_url,
        packagePerAnnum: job.package_per_annum,
      }

      const updatedSimilarJobs = data.similar_jobs.map(similarJob => ({
        id: similarJob.id,
        title: similarJob.title,
        rating: similarJob.rating,
        jobDescription: similarJob.job_description,
        location: similarJob.location,
        employmentType: similarJob.employment_type,
        companyLogoUrl: similarJob.company_logo_url,
      }))

      this.setState({
        jobData: updatedJobsData,
        similarItemsData: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderCurrentView = () => {
    const {apiStatus} = this.state
    let currentJobsView

    switch (apiStatus) {
      case apiStatusConstants.success:
        currentJobsView = this.renderSuccessView()
        break
      case apiStatusConstants.failure:
        currentJobsView = this.renderJobsFailureView()
        break
      case apiStatusConstants.inProgress:
        currentJobsView = this.renderProfileLoadingView()
        break

      default:
        break
    }
    return currentJobsView
  }

  renderProfileLoadingView = () => (
    <div className="loader-container-profile" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsFailureView = () => (
    <div className="no-jobs-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-text">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobData, similarItemsData} = this.state
    const {
      companyWebsiteUrl,
      title,
      rating,
      location,
      jobDescription,
      employmentType,
      companyLogoUrl,
      packagePerAnnum,
      lifeAtCompany,
      skills,
    } = jobData
    console.log(skills)
    console.log(lifeAtCompany)

    return (
      <div className="job-item-details-container">
        <div className="job-item">
          <div className="logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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

          <div className="description-container">
            <h1 className="description-head">Description</h1>
            <a
              rel="noreferrer"
              target="_blank"
              className="link"
              href={companyWebsiteUrl}
            >
              Visit <BiLinkExternal />
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="description-head">Skills</h1>
          <ul className="skills-container">
            {skills !== undefined &&
              skills.map(each => {
                const {name, imageUrl} = each
                return (
                  <li className="skill-item" key={name}>
                    <img src={imageUrl} alt={name} className="skill-image" />
                    <p className="description-head">{name}</p>
                  </li>
                )
              })}
          </ul>
          <h1 className="description-head">Life at Company</h1>
          <p className="job-description">{lifeAtCompany.description}</p>
          <img
            src={lifeAtCompany.imageUrl}
            alt="life at company"
            className="life-at-company-image"
          />
        </div>
        <h1 className="description-head">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarItemsData.map(item => (
            <SimilarItem item={item} key={item.id} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    return (
      <div className="jobs-bg-container">
        <Headers />
        {this.renderCurrentView()}
      </div>
    )
  }
}

export default JobItemDetails
