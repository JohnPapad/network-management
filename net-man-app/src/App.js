import React, { Component } from 'react';
import './App.css';
import { Container, Row, Col } from 'reactstrap';
import CreateNetwork from './containers/CreateNetwork/createNetwork';
import DeleteNetwork from './containers/DeleteNetwork/deleteNetwork';

import ApplicationMenu from './containers/ApplicationMenu/applicationMenu';

import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import Footer from './components/Footer/footer'
import NetNavbar from './components/NetNavbar/netNavbar';

import { networkApi } from './services/networkApi';

import produce from 'immer';

class App extends Component {

    state = {
        networkCreated: null
    }

    componentDidMount() {
        this.checkNetworkStatus();
    }

    // componentDidUpdate() {
    //      this.checkNetworkStatus();
    // }

    checkNetworkStatus = () => {
        networkApi.networkExists()
        .then(data => {
            this.setState(
                produce(draft => {
                    draft.networkCreated = data.status === "up";
                })
            );
        });
    }

    networkStateHandler = () => {
		this.setState(
			produce(draft => {
				draft.networkCreated = !draft.networkCreated;
			})
		);
    }

    withoutNetRoutes = () => {
        return(
			<Switch>
				<Route 
					path={["/create_network"]} 
					exact
					render={() => ( <CreateNetwork networkStateHandler={this.networkStateHandler}/> )}
				/>


				<Route
					path={ ["/delete_network"] }
					exact
					render={() => ( <DeleteNetwork networkStateHandler={this.networkStateHandler}/> )}
                />

				<Redirect to="/create_network" />
			</Switch>
		);
    }


    withNetRoutes = () => {
		return(
			<Switch>

				<Route
					path={ ["/"] }
					exact
					render={() => ( <ApplicationMenu />)} /> )}
				/>

				<Route
					path={ ["/delete_network"] }
					exact
					render={() => ( <DeleteNetwork networkStateHandler={this.networkStateHandler}/> )}
                />

				<Redirect to="/" />
			</Switch>
		);
	}


    render() {

        console.log("Network Created: ", this.state.networkCreated);

        return (
            <div className="App">
                <div className="AppContents">
                    <NetNavbar networkCreated={this.state.networkCreated} />
                    <Container fluid className="content">

                        {this.state.networkCreated ? 
                            this.withNetRoutes()
                            : 
                            this.withoutNetRoutes()
                        }

                    </Container>
            
                </div>
                <Footer/>
            </div>
        );
    }


}

export default withRouter(App);
