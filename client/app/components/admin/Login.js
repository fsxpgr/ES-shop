import React from 'react';
import validateInput from '../../../../server/validation/login';
import axios from 'axios';
import { browserHistory, Link, hashHistory } from 'react-router';

import Lgn from './css/Login.css';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {},
      isLoading: false,
      badErrors: ''
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {

      this.setState({ errors: {} });

      var userData = {
        email: this.state.email,
        password: this.state.password
      }
      axios.post('/login', userData).then(
        (response) => {
          this.props.login(response.data);
          browserHistory.push('/');
        }
      ).catch(err => {
        this.setState({ badErrors: err });
        console.log(err);
      });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { badErrors, errors, email, password, isLoading } = this.state;

    return (

      <div className="mui-container">
        <div className="mui-row">
          <div className="mui-col-md-3"></div>
          <div className="mui-col-md-6">
            <div className="mui-panel admin-miu-panel">

              <form onSubmit={this.onSubmit}>

                <div className="mui-textfield large-input">
                  <input className="form-control"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="email"
                    name="email"
                    required />
                  <label>E-mail</label>
                </div>

                <div className="mui-textfield large-input">
                  <input
                    value={this.state.password}
                    onChange={this.onChange}
                    type="password"
                    name="password" 
                    required/>
                  <label>Password</label>
                </div>

                {badErrors && <div className="mui-panel mui--text-subhead mui--text-center wrong-loggin mui--z2"><i class="material-icons">warning </i> <span>Wrong email or password!</span></div>}
                
                  <button disabled={this.state.isLoading} className="mui-btn mui-btn--large mui-btn--primary mui-btn--raised login-btn" >
                  Log in
                  </button>
              
              </form>

            </div>
          </div>
          <div className="mui-col-md-3"></div>
        </div>
      </div>

    );
  }
}


export default LoginForm;