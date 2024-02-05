import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  success: 'SUCCESS',
  inProgress: 'LOADING',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: '',
    activeOptionId: sortbyOptions[0].optionId,
    searchValue: '',
    activeCategoryId: '',
    activeRatingId: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    const {activeCategoryId, activeRatingId, searchValue} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchValue}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  // TODO: Here we update the values of the state by selecting options
  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  //  updated the state with search value text
  getSearchValue = searchText => {
    this.setState({searchValue: searchText})
    console.log(searchText)
  }

  // on key Enter api call
  searchEnterText = () => {
    this.getProducts()
  }

  // updated the state with category option Id
  getCategoryId = categoryId => {
    this.setState({activeCategoryId: categoryId}, this.getProducts)
  }

  //  updated the state with rating option Id
  getRatingId = ratingId => {
    this.setState({activeRatingId: ratingId}, this.getProducts)
  }

  filterResults = () => {
    this.setState(
      {
        activeCategoryId: '',
        activeRatingId: '',
        searchValue: '',
      },
      this.getProducts,
    )
  }

  renderNoProductsView = () => (
    <div className="none-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="none-img"
      />
      <h1 className="none-title">No Products Found</h1>
      <p className="none-text">
        We could not find any products. Try other filters.
      </p>
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-image"
      />
      <h1 className="failure-title">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We are having some trouble processing request.Please try again.
      </p>
    </div>
  )

  renderProductsView = () => {
    const {productsList, activeOptionId} = this.state
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductsList = () => {
    const {productsList} = this.state
    const isEmpty = productsList.length > 0

    return isEmpty ? this.renderProductsView() : this.renderNoProductsView()
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderApiStatusResponseView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsList()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId, activeRatingId} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          getSearchValue={this.getSearchValue}
          searchEnterText={this.searchEnterText}
          getCategoryId={this.getCategoryId}
          getRatingId={this.getRatingId}
          filterResults={this.filterResults}
        />

        {this.renderApiStatusResponseView()}
      </div>
    )
  }
}

export default AllProductsSection
