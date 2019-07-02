import React, {Component, Fragment} from "react";
import {Route, Switch,} from "react-router-dom";


import Alerts from "./layout/Alerts";
import Login from "./layout/Login";
import PrivateRoute from "./common/PrivateRoute";

import store from "../store";
import {loadUser} from "../actions/auth";
import ChallengeList from "./layout/ChallengeList";
import Headers from "./layout/Header";
import CreateUser from "./layout/CreateUser";
import UpdateUser from "./layout/UpdateUser";
import CreateCourse from "./layout/CreateCourse";
import CreateChallenge from "./layout/CreateChallenge";
import StaffRoute from "./common/StaffRoute";
import CourseList from "./layout/CourseList";
import {fetchChallenges, fetchCourses} from "../actions/application";
import EnrollUser from "./layout/EnrollUser";


export default class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
        store.dispatch(fetchChallenges())
        store.dispatch(fetchCourses())

    }

    render() {
        return (
            <Fragment>
                <Headers/>
                <Alerts/>
                <div className="container">
                    <Switch>
                        <Route exact path="/login" component={Login}/>


                        <PrivateRoute exact path="/" component={ChallengeList}/>
                        <PrivateRoute exact path="/challenges" component={ChallengeList}/>
                        <PrivateRoute exact path="/updateUser" component={UpdateUser}/>


                        <StaffRoute exact path="/createCourse" component={CreateCourse}/>
                        <StaffRoute exact path="/createChallenge" component={CreateChallenge}/>
                        <StaffRoute exact path="/register" component={CreateUser}/>
                        <StaffRoute exact path="/courses" component={CourseList}/>
                        <StaffRoute exact path="/enrollment" component={EnrollUser}/>


                    </Switch>
                </div>
            </Fragment>
        );
    }
}

