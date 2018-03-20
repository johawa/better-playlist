import React from 'react';


export class Searchform extends React.Component {
    render() {
      return (
        <form id="search-form">
          <h2>Search For an Artist:</h2>
          <input type="text" id="query" className="form-control" placeholder="Type an Artist Name" />
          <input type="submit" id="search" className="btn btn-primary" value="Search" />
        </form>
      );
    }
  }