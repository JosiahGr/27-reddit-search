import React from 'react';
import { render as reactDomRender } from 'react-dom'; 
import superagent from 'superagent';
import './style/main.scss';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormBoard: '',
      searchFormLimit: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchFormLimitChange = this.handleSearchFormLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSearchChange(event) {
    this.setState({ searchFormBoard: event.target.value });
  }

  handleSearchFormLimitChange(event) {
    this.setState({ searchFormLimit: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.searchSelect(this.state.searchFormBoard);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text"
          name="searchFormBoard"
          placeholder="Search for a Reddit board"
          value={this.state.searchFormBoard}
          onChange={this.handleSearchChange}
        />
      </form>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditLookup: {},
      searchFormBoard: null,
      searchFormLimit: null,
      redditResponseError: null,
    };

    this.searchSelect = this.searchSelect.bind(this);
    this.renderSearchList = this.renderSearchList.bind(this);
  }

  searchSelect(searchFormBoard) {
    return superagent.get(`http://www.reddit.com/r/${searchFormBoard}.json?limit=20`)
      .then((response) => {
        this.setState({
          searchFormBoard: response.body,
          redditResponseError: null,
        });
      })
      .catch(() => {
        this.setState({
          redditResponseError: searchFormBoard,
        });
      });
  }

  renderSearchList(list) {
    if (list !== null) {
      return (
      <ul>
        { list.data.children.map((item, index) => {
          return (
            <li key={index}>
              <a href={item.data.url}>{item.data.title}</a>
              <p>{item.data.ups}</p>
            </li>
          );
        })}
      </ul>
      );
    }
    return undefined;
  }

  render() {
    return (
      <section>
        <h1>Search Topic</h1>
        <SearchForm searchSelect={this.searchSelect}/>
        {
          this.state.redditResponseError ?
          <div>
            <h2 className="error">
            {`"${this.state.redditResponseError}"`} does not exist
            </h2>
          </div> :
          <div>
            <h2>Search result:</h2>
            { this.renderSearchList(this.state.searchFormBoard)}
          </div>
        }
      </section>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

reactDomRender(<App />, container);
