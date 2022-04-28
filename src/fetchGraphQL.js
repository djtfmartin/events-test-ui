async function fetchGraphQL(text, variables) {

    // Fetch data from GitHub's GraphQL API:
    let response = await fetch( "http://localhost:4000/graphql",{
        url: "http://localhost:4000/graphql",
        headers: { 'Content-Type' : 'application/json', 'Accept': 'application/json'},
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify( { query: text })
        // body: JSON.stringify(query_data)
    }).then((data) => data.json());

    return response;
}

export default fetchGraphQL;