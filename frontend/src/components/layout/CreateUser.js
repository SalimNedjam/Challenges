import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createUser } from "../../actions/auth";
import { createMessage } from "../../actions/messages";

export class CreateUser extends Component {
  state = {
    matricule: "",
    username: "",

  };

  static propTypes = {
    createUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  onSubmit = e => {
    e.preventDefault();
    const { matricule, username } = this.state;
    const newUser = {
        matricule,
        username
    }
      this.props.createUser(newUser);
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {

    const { matricule, username } = this.state;
    return (
      <div className="col-md-6 m-auto">
        <div className="card card-body mt-5">
          <h2 className="text-center">Ajouter un étudient</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Matricule</label>
              <input
                type="text"
                className="form-control"
                name="matricule"
                onChange={this.onChange}
                value={matricule}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="username"
                className="form-control"
                name="username"
                onChange={this.onChange}
                value={username}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Ajouter
              </button>
            </div>

          </form>
        </div>
      </div>
    );
  }
}



const mapStateToProps = (state) => {
  console.log(state)
    return {isAuthenticated: state.auth.isAuthenticated};
};

export default connect(mapStateToProps, { createUser, createMessage })(CreateUser);