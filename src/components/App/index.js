import React, { Component } from 'react';
import ButtonWithLoading from 'components/withLoading/index';
import Table from 'components/Table/index';
import Search from 'components/Search/index';
import axios from 'axios';  // Use Axios library to perform asynchronous requests to remote APIs. It uses HTTP GET request by default.
import './index.css';
import { 
    DEFAULT_QUERY, 
    DEFAULT_HPP, 
    PATH_BASE, 
    PATH_SEARCH, 
    PARAM_SEARCH, 
    PARAM_PAGE, 
    PARAM_HPP, 
} from '../../constants/index.js';

// Higher-order function.
const updateSearchTopStoriesState = (hits, page) => (prevState) => {
    const { searchKey, results } = prevState;

    // The old hits get retrieved from the results map with the searchKey as key.
    const oldHits = results && results[searchKey]
        ? results[searchKey].hits
        : [];

    // Merge old and new hits from the recent API request. Using the ES6 array spread operator.
    const updatedHits = [
        ...oldHits,
        ...hits
    ];

    return {
        results: {
            ...results,
            [searchKey]: { hits: updatedHits, page }    // Makes sure to store the updated result by searchKey in the results map.
        },
        isLoading: false
    };
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null,
            isLoading: false,
        };

        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    // Checks if cache stores the searched term already--is used it in onSearchSubmit method.
    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }

    setSearchTopStories(result) {
        const { hits, page } = result;
        this.setState(updateSearchTopStoriesState(hits, page));
    }

    // The native fetch API function is used to perform an asynchronous request.
    // The response is transformed to a JSON data structure -- mandatory.
    // After it is set as result in the local component state -- optional.
    // If an error occurs during the request, the function runs into the catch block instead of the then block.
    // *page = 0 is the default function parameter, is used if no value or undefined is passed.
    fetchSearchTopStories(searchTerm, page = 0) {
        this.setState({ isLoading: true });

        axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(result => this.setSearchTopStories(result.data))
            .catch(error => this.setState({ error }));  // Use catch block to store the error object in th local state.
    }

    // The component mounted -> time to fetch the data.
    componentDidMount() {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        this.fetchSearchTopStories(searchTerm);
    }

    onSearchSubmit(event) {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });

        // Prevent the API request when a result is available in the cache.
        if (this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }

        event.preventDefault();
    }

    onSearchChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    onDismiss(id) {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];

        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);

        this.setState({
            results: {
                ...results, // The spread operator used to copy the object to another object.
                [searchKey]: { hits: updatedHits, page }
            }
        });
    }

    render() {
        const {
            searchTerm,
            results,
            searchKey,
            error,
            isLoading,
        } = this.state;

        const page = (results && results[searchKey] && results[searchKey].page) || 0;

        // Default to an empty list when there is no result by searchKey.
        const list = (results && results[searchKey] && results[searchKey].hits) || [];
        if (error) {
            return <p> Oops, something went wrong.</p>;
        }

        // See the JSON response in the console.
        console.log(this.state);
        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    >
                        Search
                    </Search>
                </div>
                {error  // Error handling in cas the API request fails.
                    ? <div className="interactions">
                        <p>Oops, something went wrong.</p>
                    </div>
                    : <Table
                        list={list}
                        onDismiss={this.onDismiss}
                    />
                }
                <div className="interactions">
                    <ButtonWithLoading
                        isLoading={isLoading}
                        onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
                    >
                        More
                    </ButtonWithLoading>
                </div>
            </div>
        );
    }
}

export default App;