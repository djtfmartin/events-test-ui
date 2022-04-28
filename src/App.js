import React from 'react';
import './App.css';
import Search from "./components/Search"
import Banner from "./components/Banner"
import {Container} from "react-bootstrap";
import BreadCrumb from "./components/BreadCrumb";

function App() {
    return (
        <div>
        <Banner />
        <BreadCrumb />
        <Container fluid>
            <Search />
        </Container>
        </div>
    );
}
export default App;