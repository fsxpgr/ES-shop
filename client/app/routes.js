import React from 'react';
import { Router, Route, IndexRoute, browserHistory, Link, hashHistory  } from 'react-router';

// admin import
import Admin from './components/admin/Admin'
import Create from './components/admin/Create'
import List from './components/admin/List'
import ListDis from './components/admin/dis/ListDis';
import CreateDis from './components/admin/dis/CreateDis';
import NotFound from './components/admin/NotFound'
import LoginForm from './components/admin/Login'
import ListOrder from './components/admin/ListOrder'
import App from './components/App';

export default (
    <div>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Admin} />
                <Route path="/admin/list" component={List} />
                <Route path="/admin/create" component={Create} />
                <Route path="/admin/login" component={LoginForm} />
                <Route path="/admin/create_discount" component={CreateDis} />
                <Route path="/admin/list_discount" component={ListDis} />
                <Route path="/admin/list_order" component={ListOrder} />
                <Route path="*" component={NotFound} />     
            </Route>
        </Router>
    </div>
)