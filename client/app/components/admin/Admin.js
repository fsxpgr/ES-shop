import React, { Component } from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import axios from 'axios';

import './css/Admin.css';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    componentWillMount() {
        //*isLogged*//
        axios.post('/').then(response => {
            if (response.data.Logged === false) {
                browserHistory.push('/admin/login')
            }
        })
        //*isLogged*//
    }

    render() {
        return (
            <div className="mui-container ">
                <div className='admin-miu-panel'>
                  
                    <div className="mui-row">
                        <div className="mui-col-md-12">
                            <div className="mui-panel marg-top">
                                <div className="mui-row">
                                    <div className="mui-col-md-4">
                                        <Link to='/admin/create'>
                                            <div class="mui-panel admin-card card1">
                                                <i class="material-icons">add_shopping_cart</i>
                                                <div className="mui--text-center mui--text-headline">Create new product in shop</div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="mui-col-md-4">
                                        <Link to='/admin/list'>
                                            <div class="mui-panel admin-card card2">
                                                <i class="material-icons">view_list</i>
                                                <div className="mui--text-center mui--text-headline">View list of the products</div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="mui-col-md-4">
                                        <Link to='/admin/list_order'>
                                            <div class="mui-panel admin-card card3">
                                            <i class="material-icons">shopping_cart</i>
                                                <div className="mui--text-center mui--text-headline">Order history</div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="mui-col-md-4">
                                        <Link to='/admin/create_discount'>
                                            <div class="admin-card card4">
                                            <i class="material-icons">content_cut</i>
                                                <div className="mui--text-center mui--text-headline">Create discount</div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="mui-col-md-4">
                                        <Link to='/admin/list_discount'>
                                            <div class="admin-card card5">
                                            <i class="material-icons">format_list_bulleted</i>
                                                <div className="mui--text-center mui--text-headline">Discounts list</div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="mui-col-md-4">
                                        <Link to='/admin/login'>
                                            <div class="admin-card card6" onClick={this.props.logout}>
                                           <i class="material-icons">power_settings_new</i>
                                                <div className="mui--text-center mui--text-headline">Log out</div>
                                            </div>
                                        </Link>
                                    </div>
              
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
