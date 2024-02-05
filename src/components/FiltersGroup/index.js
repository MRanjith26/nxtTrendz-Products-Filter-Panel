import './index.css'
import {BsSearch} from 'react-icons/bs'

const FiltersGroup = props => {
  const {getSearchValue} = props

  const renderCategoryListView = () => {
    const {categoryOptions} = props

    return categoryOptions.map(eachCategory => {
      const {getCategoryId, activeCategoryId} = props

      //  callback awake from user selected category
      const onClickCategoryId = () => {
        getCategoryId(eachCategory.categoryId)
      }

      const colorStyles =
        activeCategoryId === eachCategory.categoryId ? 'act-text' : ''

      return (
        <li
          key={eachCategory.categoryId}
          onClick={onClickCategoryId}
          className="category-item"
        >
          <p className={`category-text ${colorStyles}`}>{eachCategory.name}</p>
        </li>
      )
    })
  }

  const renderCategoryOptionView = () => (
    <ul className="category-container">
      <h1 className="title-text">Category</h1>
      {renderCategoryListView()}
    </ul>
  )

  const renderRatingsListView = () => {
    const {ratingsList} = props

    return ratingsList.map(eachRating => {
      const {getRatingId, activeRatingId} = props

      const onClickRatingId = () => {
        //  callback awake from user selected rating
        getRatingId(eachRating.ratingId)
      }

      const colorStyles =
        activeRatingId === eachRating.ratingId ? 'act-text-rating' : ''

      return (
        <li
          className="rating-item"
          key={eachRating.ratingId}
          onClick={onClickRatingId}
        >
          <img
            src={eachRating.imageUrl}
            alt={`rating ${eachRating.ratingId}`}
            className="rating-image"
          />
          <p className={`rating-text ${colorStyles}`}>& up</p>
        </li>
      )
    })
  }

  const renderRatingsView = () => (
    <ul className="ratings-container">
      <h1 className="title-text">Rating</h1>
      {renderRatingsListView()}
    </ul>
  )

  const onChangeSearchValue = event => {
    getSearchValue(event.target.value)
  }

  const onSearchInputText = event => {
    const {searchEnterText} = props
    if (event.key === 'Enter') {
      searchEnterText()
    }
  }

  const renderSearchContainer = () => (
    <div className="search-container">
      <input
        type="search"
        className="input-text"
        placeholder="Search"
        onChange={onChangeSearchValue}
        onKeyDown={onSearchInputText}
      />
      <BsSearch className="search-icon" />
    </div>
  )

  const renderResetButton = () => {
    const {filterResults} = props
    return (
      <button type="button" className="reset-button" onClick={filterResults}>
        Clear Filters
      </button>
    )
  }

  return (
    <div className="filters-group-container">
      {renderSearchContainer()}
      {renderCategoryOptionView()}
      {renderRatingsView()}
      {renderResetButton()}
    </div>
  )
}
export default FiltersGroup
