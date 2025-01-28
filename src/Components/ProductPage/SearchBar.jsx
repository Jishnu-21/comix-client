import React from 'react';
import '../../Assets/Css/ProductPage/SearchBar.scss';

const SearchBar = ({searchTerm, handleSearch}) => {
    return (
        <div className="search-bar-container-product">
            <form className="form-container2">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search products..." 
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-light" onClick={(e) => e.preventDefault()}>
                    <i className="fas fa-search"></i>
                </button>
            </form>
        </div>
    );
}

export default SearchBar;
