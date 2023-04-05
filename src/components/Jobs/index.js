import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import './index.css'
import Headers from '../Headers'
import JobItem from '../JobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  success: 'SUCCESS',
  initial: 'INITIAL',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profielApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    profileData: {},
    jobsList: [],
    searchInput: '',
    employmentTypeList: [],
    minimumPackage: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({profielApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedData,
        profielApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profielApiStatus: apiStatusConstants.failure})
    }
  }

  getJobsData = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, employmentTypeList, minimumPackage} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeList.join()}&minimum_package=${minimumPackage}&search=${searchInput}`
    console.log(url)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        rating: job.rating,
        jobDescription: job.job_description,
        location: job.location,
        employmentType: job.employment_type,
        companyLogoUrl: job.company_logo_url,
        packagePerAnnum: job.package_per_annum,
      }))
      console.log(updatedJobsData)
      this.setState({
        jobsList: updatedJobsData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  renderProfielSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-bg-container">
        <img src={profileImageUrl} className="profile-image" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileLoadingView = () => (
    <div className="loader-container-profile" data-testid="loader">
      <Loader type="ThreeDots" color=" #6366f1" height="50" width="50" />
    </div>
  )

  renderProfielFailureView = () => (
    <div className="loader-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.getProfileData}
      >
        Retry
      </button>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />
          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-text">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }
    return (
      <ul className="jobs-container">
        {jobsList.map(job => (
          <JobItem job={job} key={job.id} />
        ))}
      </ul>
    )
  }

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
      <button type="button" className="retry-button" onClick={this.getJobsData}>
        Retry
      </button>
    </div>
  )

  onChangeSalaryFilters = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobsData)
  }

  onChangeEmploymentFilters = event => {
    if (event.target.checked === true) {
      this.setState(
        prevState => ({
          employmentTypeList: [
            ...prevState.employmentTypeList,
            event.target.value,
          ],
        }),
        this.getJobsData,
      )
    } else {
      this.setState(
        prevState => ({
          employmentTypeList: prevState.employmentTypeList.filter(
            each => each !== event.target.value,
          ),
        }),
        this.getJobsData,
      )
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchBtn = () => {
    this.getJobsData()
    this.setState({searchInput: ''})
  }

  renderJobsCurrentView = () => {
    const {jobsApiStatus} = this.state
    let currentJobsView

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        currentJobsView = this.renderJobsSuccessView()
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

  renderProfileAndFilters = () => {
    const {profielApiStatus, searchInput} = this.state
    let currentProfileView

    switch (profielApiStatus) {
      case apiStatusConstants.success:
        currentProfileView = this.renderProfielSuccessView()
        break
      case apiStatusConstants.failure:
        currentProfileView = this.renderProfielFailureView()
        break
      case apiStatusConstants.inProgress:
        currentProfileView = this.renderProfileLoadingView()
        break

      default:
        break
    }
    return (
      <div className="profile-filters-container ">
        <div className="search-container-sm">
          <input
            placeholder="Search"
            type="search"
            className="search-input"
            onChange={this.onChangeSearchInput}
            value={searchInput}
          />
          <button
            type="button"
            data-testid="searchButton"
            className="icon-button"
            onClick={this.onClickSearchBtn}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        {currentProfileView}
        <hr className="horizontal-line" />
        <h1 className="filters-heading">Type of Employment</h1>
        <ul className="employment-container">
          {employmentTypesList.map(each => {
            const {label, employmentTypeId} = each
            return (
              <li className="list-item" key={employmentTypeId}>
                <input
                  type="checkbox"
                  value={employmentTypeId}
                  className="checkbox"
                  id={employmentTypeId}
                  onChange={this.onChangeEmploymentFilters}
                />
                <label className="filter-label" htmlFor={employmentTypeId}>
                  {label}
                </label>
              </li>
            )
          })}
        </ul>
        <hr className="horizontal-line" />
        <h1 className="filters-heading">Salary Range</h1>
        <ul className="employment-container">
          {salaryRangesList.map(each => {
            const {label, salaryRangeId} = each
            return (
              <li className="list-item" key={salaryRangeId}>
                <input
                  type="radio"
                  name="salary"
                  value={salaryRangeId}
                  className="checkbox"
                  id={salaryRangeId}
                  onChange={this.onChangeSalaryFilters}
                />
                <label className="filter-label" htmlFor={salaryRangeId}>
                  {label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  render() {
    const {jobsApiStatus, searchInput} = this.state
    console.log(jobsApiStatus)
    return (
      <div className="jobs-bg-container">
        <Headers />
        <div className="bottom-container">
          <div className="left-container">{this.renderProfileAndFilters()}</div>
          <div className="right-container">
            <div className="search-container-lg">
              <input
                placeholder="Search"
                type="search"
                className="search-input"
                onChange={this.onChangeSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="icon-button"
                onClick={this.onClickSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsCurrentView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
