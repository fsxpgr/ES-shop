import React from 'react';
import NavigationBar from './admin/navigationBar';
import axios from 'axios';
import { browserHistory, Link, hashHistory } from 'react-router';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
      username: 'Guest'
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(username) {
    this.setState({
      isAuth: true,
      username: username
    });
  }

  logout() {
    axios.post('/logout').then(response => {
      this.setState({
        isAuth: false,
        username: 'Guest'
      });
    }
    );
  }

  componentWillMount() {
    axios.post('/').then(response => {
      if (response.data.Logged === false) {
        this.setState({
          isAuth: false,
        });
      }
      else {
        this.setState({
          isAuth: true,
          username: response.data
        });
      }
    }
    );
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        login: this.login,
        isAuth: this.state.isAuth
      })
    );


    return (
      <div className="container">
        <NavigationBar
          isAuth={this.state.isAuth}
          logout={() => this.logout()}
        />
        {childrenWithProps}
      </div>
    );
  }
}


export default App;