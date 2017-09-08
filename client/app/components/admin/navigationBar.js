import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { browserHistory } from 'react-router';

export default class NavigationBar extends React.Component {


  render() {

    const loggedAsAdmin = (
      <header id="header" class="header-shadow mui-container-fluid mui-appbar mui--z2 no-padding">
        <table width="100%" cellSpacing="0">
          <tbody>
            <tr>
              <td class="mui--text-left t-head">
                <div className="mui--text-light mui--text-headline nav-click" onClick={browserHistory.goBack}><i class="material-icons i-left">keyboard_arrow_left</i>BACK</div>
              </td>
              <td class="mui--text-center t-head">
                <Link to="/" className="mui--text-light mui--text-display1"><strong>ES Shop </strong> Admin Panel</Link>
              </td>
              <td class="mui--text-right mui--text-dark mui--text-headline t-head">
              <Link to='/admin/login' className="mui--text-light mui--text-headline nav-click" onClick={this.props.logout}>Log out<i class="material-icons i-right">power_settings_new</i></Link> 
              </td>
            </tr>
          </tbody>
        </table>
      </header>
    )

    const notLogged = (
      <header id="header" class="header-shadow mui-container-fluid mui-appbar mui--z2 no-padding">
        <table width="100%" cellSpacing="0">
          <tbody>
            <tr>
              <td class="mui--text-left t-head">
                <div className="mui--text-light mui--text-headline nav-click hide" onClick={browserHistory.goBack}><i class="material-icons i-left">keyboard_arrow_left</i>BACK</div>
              </td>
              <td class="mui--text-center t-head">
                <Link to="/" className="mui--text-light mui--text-display1"><strong>ES Shop </strong> Admin Panel</Link>
              </td>
              <td class="mui--text-right mui--text-dark mui--text-headline t-head">
                <Link to='/admin/login' className="mui--text-light mui--text-headline nav-click" onClick={this.props.logout}>Log in<i class="material-icons i-right">power_settings_new</i></Link> 
              </td>
            </tr>
          </tbody>
        </table>
      </header>
    );


    return (
      <div>
        {this.props.isAuth ? loggedAsAdmin : notLogged}
      </div>
    );
  }
}