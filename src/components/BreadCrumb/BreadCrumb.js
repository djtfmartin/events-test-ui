import React from "react";

class BreadCrumb extends React.Component {
    render() {
        return <section id="breadcrumb">
                    <nav aria-label="Breadcrumb" role="navigation">
                        <ol className="breadcrumb-list">
                            <li><a href="http://www.ala.org.au">Home</a></li>
                            <li className="active">Survey search</li>
                        </ol>
                    </nav>
        </section>
    }
}

export default BreadCrumb;