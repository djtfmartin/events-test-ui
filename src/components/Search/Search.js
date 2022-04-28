import React from "react";

import Button from 'react-bootstrap/Button';
import {FormControl, InputGroup, Row} from "react-bootstrap";

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            error: null,
            isLoaded: false,
            results: {}
        };
    }

    componentDidMount() {
        this.doSearch();
    }

    doSearch(queryStr) {

        if (!queryStr){
            queryStr = "*"
        }

        let query_text = `query {
                  eventSearch(q: "${queryStr}" limit: 20, offset: 0) {
                    count
                    limit
                    offset
                    results {
                      eventID
                      type
                      eventType
                      parentEventID
                      datasetKey
                      datasetTitle
                      samplingProtocol
                      countryCode
                      year
                      day
                      month
                      decimalLatitude
                      decimalLongitude
                      occurrenceCount
                      measurementOrFactTypes
                      measurementOrFactCount
                    }
                    facets {
                      name
                      counts {
                        name
                        count
                      }
                    }
                  }
                }
            `;

        fetch("http://localhost:4000/graphql", {
            url: "http://localhost:4000/graphql",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({query: query_text})
        })
            .then((data) => data.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        results: result.data.eventSearch
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }


    render() {
        const { searchQuery, error, isLoaded, results } = this.state;

        function truncate(str) {
            return str.length > 40 ? str.substring(0, 40) + "..." : str;
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className={"searchComponent"}>
                    <Row>
                        <div className={"searchBar col-md-6"}>
                            <InputGroup>
                                <FormControl
                                    onKeyDown={evt => this.handleKeyPress(evt)}
                                    onChange={evt => this.updateInputValue(evt)}
                                    placeholder="Search by eventID"
                                />
                                <span className={"input-group-btn"}>
                                    <Button
                                        className={'btn btn-primary'}
                                        id="button-addon2"
                                        onClick={event => this.setQuery()}
                                    >
                                    Search
                                    </Button>
                                </span>
                            </InputGroup>
                        </div>
                    </Row>
                    <Row>
                        <div className={"searchBarButtons"}>
                            <InputGroup className="mb-3">
                                <Button variant="outline-primary" id="button-addon2">
                                    Sampling protocols
                                </Button>
                                <Button variant="outline-primary" id="button-addon2">
                                    Measurement types
                                </Button>
                                <Button variant="outline-primary" id="button-addon2">
                                    Event types
                                </Button>
                                <Button variant="outline-primary" id="button-addon2">
                                    Surveys with occurrences
                                </Button>
                                <Button variant="outline-primary" id="button-addon2">
                                    Taxonomy
                                </Button>
                                <Button variant="outline-primary" id="button-addon2">
                                    Year
                                </Button>
                                <Button variant="outline-primary" id="button-addon2">
                                    State
                                </Button>
                            </InputGroup>
                        </div>
                    </Row>

                    <Row>
                        <div className={'searchFacetsContainer col-md-2' }>
                            <div className={'searchFacets rounded-top rounded-bottom' }>
                                {results.facets.map(facet => (
                                    <div className={"text-start top-buffer"}>
                                        <h6>{facet.name}</h6>
                                        <ul className={"list-group"}>
                                            {facet.counts.map(facetCount => (
                                                <li className={"list-group-item  py-1 d-flex justify-content-between align-items-center"}>
                                                    {truncate(facetCount.name)}
                                                    <span className="facetCount">
                                                    {facetCount.count}
                                                </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={'searchTable col-md-10 p-6'}>

                            <table className={'table table-bordered table-sm'}>
                                <thead>
                                    <tr>
                                        <th>Event ID</th>
                                        <th>Type</th>
                                        <th>Event type</th>
                                        <th>Parent Event ID</th>
                                        <th>Dataset</th>
                                        <th>Year</th>
                                        <th>Sampling protocol</th>
                                        <th>Coordinates</th>
                                        <th>State province</th>
                                        <th>Country</th>
                                        <th>Measurement types</th>
                                        <th>Measurements</th>
                                        <th>Occurrence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {results.results.map(item => (
                                    <tr key={item.eventID} id={item.eventID}>
                                        <td>{item.eventID}</td>
                                        <td>{item.type}</td>
                                        <td>{item.eventType}</td>
                                        <td>{item.parentEventID}</td>
                                        <td><small>{item.datasetTitle}</small></td>
                                        <td>{item.year}</td>
                                        <td>{item.samplingProtocol}</td>
                                        <td>{item.decimalLatitude ? item.decimalLatitude + ',' + item.decimalLongitude: ''}</td>
                                        <td>{item.stateProvince}</td>
                                        <td>{item.countryCode}</td>
                                        <td>{item.measurementOrFactTypes ? item.measurementOrFactTypes.join(", ") : ''}</td>
                                        <td>{item.measurementOrFactCount}</td>
                                        <td>{item.occurrenceCount}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <h6 className={"p-3"}>
                                Results count: <span>{ results.count }</span>,
                                Offset: <span>{ results.offset }</span>,
                                Limit: <span>{ results.limit }</span>
                            </h6>
                        </div>
                    </Row>
                </div>
            );
        }
    }

    handleKeyPress(event) {
        if (event.keyCode === 13    ){
            this.doSearch(this.state.searchQuery)
        }
    }

    updateInputValue(evt) {
        this.setState({searchQuery: evt.target.value})
    }


    setQuery() {
        this.doSearch(this.state.searchQuery)
    }
}

export default Search;
