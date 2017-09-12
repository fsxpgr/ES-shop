import React, { Component } from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import Spinner from './../Spinner';

import './../css/CreateDis.css';

export default class CreateDis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            disDB: { product: [], dateExpired: moment(), disCode: "" },
            loading: true,
            mLoading: true,
            pBefore: '',
            pAfter: '',
            arrPrBefore: [],
            arrPrAfter: [],
            arrImg: [],
            offset: 0,
        }
        this.handleDisCode = this.handleDisCode.bind(this);
        this.handleProdDisc = this.handleProdDisc.bind(this);
        this.handleExpDate = this.handleExpDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleDisCode(e) {
        e.preventDefault();
        let temp = this.state.disDB
        temp.disCode = e.target.value;
        this.setState({ disDB: temp })
    }
    handleProdTitle(e) {
        e.preventDefault();
        var title = e.target.value
        var allProd = this.state.data
        this.setState({ prodTitle: title })
        for (var i = 0; i < allProd.length; i++) {
            if (allProd[i].title.toString() === title.toString()) {
                this.setState({ pBefore: allProd[i].price })
            }
        }
    }
    handleProdDisc(e) {
        var percent = e.target.value
        this.setState({ discPercent: percent })
        var result = this.state.pBefore - ((percent / 100) * this.state.pBefore)
        this.setState({ pAfter: result })
    }
    handleExpDate(date) {
        let temp = this.state.disDB
        temp.dateExpired = date;
        this.setState({ disDB: temp })
    }


    getPrices() {
        var prod = this.state.disDB.product
        var allProd = this.state.allProd
        var arrPrBefore = this.state.arrPrBefore
        var arrPrAfter = this.state.arrPrAfter
        var arrImg = this.state.arrImg

        for (var i = 0; i < prod.length; i++) {
            for (var k = 0; k < allProd.length; k++) {
                if (allProd[k].title === prod[i].prodTitle) {
                    arrPrBefore.push(allProd[k].price);
                    arrImg.push(allProd[k].img[0])
                };
            }
        }
        for (var f = 0; f < arrPrBefore.length; f++) {
            arrPrAfter.push(arrPrBefore[f] - ((this.state.disDB.product[f].discount / 100) * arrPrBefore[f]))
        }
        this.forceUpdate()
    }

    updadeSearch(e) {
        this.setState({
            search: e.target.value,
            offset: 0,
            mLoading: true
        }, () => {
            axios.get(`/admin/prod`,
                {
                    params:
                    {
                        page: this.state.offset,
                        search: this.state.search
                    }
                }
            ).then(response =>
                this.setState({
                    data: response.data.doc,
                    pageCount: response.data.total_count,
                    mLoading:false
                }));
        })
    }


    handleSubmit(e) {
        e.preventDefault();
        var obj = { prodTitle: this.state.prodTitle, discount: this.state.discPercent }
        this.state.disDB.product.push(obj);
        var that = this
        axios.post('/admin/discount', {
            disCode: this.state.disDB.disCode,
            dateExpired: this.state.disDB.dateExpired,
            product: this.state.disDB.product
        })
            .then(response => {
                browserHistory.push({
                    pathname: '/admin/create_discount',
                    state: response.data.disCode
                });
                that.setState({ loading: true }, () => {
                    that.componentWillMount();
                });
            })
    }

    handleRefresh(e) {
        e.preventDefault();
        var random = Math.random().toString(36).substring(2)
        let temp = this.state.disDB
        temp.disCode = random;
        this.setState({ disDB: temp })
        if (!!this.state.disDB.disCode) {
            axios.get(`/admin/discount/${this.state.disDB.disCode}`)
                .then(response => {
                    browserHistory.push({
                        pathname: '/admin/create_discount',
                        state: this.state.disDB.disCode
                    });
                    this.setState({ loading: true }, () => {
                        this.componentWillMount();
                    });
                })
        }
    }

    handleDeleteProd(e) {
        e.preventDefault();
        var index = e.target.value;
        var arr = this.state.disDB.product
        arr.splice(index, 1)
        this.setState({ product: arr })
        axios.put(`/admin/discount/${this.props.location.state}`, {
            disCode: this.state.disDB.disCode,
            dateExpired: this.state.disDB.dateExpired,
            product: this.state.disDB.product
        })
            .then(response => { this.setState({ loading: true }, () => this.componentWillMount()) })
    }

    handleSearchDiscount(e) {
        e.preventDefault();
        if (!!this.state.disDB.disCode) {
            axios.get(`/admin/discount/${this.state.disDB.disCode}`)
                .then(response => {
                    browserHistory.push({
                        pathname: '/admin/create_discount',
                        state: this.state.disDB.disCode
                    });
                    this.setState({ loading: true }, () => {
                        this.componentWillMount();
                    });
                })
        }
    }

    handleDeleteProd(e) {
        e.preventDefault();
        var index = e.target.value;
        var arr = this.state.disDB.product
        arr.splice(index, 1)
        this.setState({ product: arr })
        axios.put(`/admin/discount/${this.props.location.state}`, {
            disCode: this.state.disDB.disCode,
            dateExpired: this.state.disDB.dateExpired,
            product: this.state.disDB.product
        })
            .then(response => { this.setState({ loading: true }, () => this.componentWillMount()) })
    }


    componentWillMount() {
        //*isLogged*//
        axios.post('/').then(response => {
            if (response.data.Logged === false) {
                browserHistory.push('/admin/login')
            }
        })
        //*isLogged*//
        var that = this;
        if (this.props.location.state) {
            axios.get(`/admin/discount/${this.props.location.state}`)
                .then(response => {
                    that.setState({
                        disDB: response.data,
                        allProd: [],
                        dateExpired: moment(),
                        product: [],
                        loading: false,
                        mLoading: true,
                        pBefore: '',
                        pAfter: '',
                        arrPrBefore: [],
                        arrPrAfter: [],
                        arrImg: []
                    })
                })
                .then(() => {
                    var titleArr = []
                    this.state.disDB.product.map((item) => { titleArr.push(item.prodTitle) })
                    if (titleArr.length !== 0) {
                        axios.post(`/admin/prod`, {
                            titleArr: titleArr
                        })
                            .then(response => {
                                that.setState({ allProd: response.data})
                                that.getPrices()
                            })
                    }
                })
                .then(() => {
                    this.setState({
                        offset: 0
                    }, () => {
                        axios.get(`/admin/prod`,
                            {
                                params:
                                {
                                    page: this.state.offset,
                                    search: ""
                                }
                            }
                        ).then(response =>
                            this.setState({
                                data: response.data.doc,
                                pageCount: response.data.total_count,
                                 mLoading: false 
                            }));
                    })
                }
                )
        }
        else {
            that.setState({
                allProd: [],
                dateExpired: moment(),
                product: [],
                disDB: { product: [], dateExpired: moment(), disCode: "" },
                loading: false,
                pBefore: '',
                pAfter: '',
                arrPrBefore: [],
                arrPrAfter: [],
                arrImg: [],
                mLoading:false
            });
        }
    }


    render() {
        return (
            <div>
                <div className="mui-container">
                    <div className="mui-row">
                        <div className="mui-col-md-1"></div>
                        <div className="mui-col-md-10">

                            <div className="mui-panel admin-miu-panel">
                                {this.state.loading ? (<div className="mui--text-center"><Spinner /></div>) : (
                                    <div>
                                        <form className="mui-form--inline">

                                            <div className="block-1">
                                                <div className="mui-textfield large-input marg-right">
                                                    <input
                                                        type="text"
                                                        value={this.state.disDB.disCode}
                                                        onChange={(e) => { this.handleDisCode(e) }}
                                                        disabled={!(this.state.disDB.product.length == 0)}
                                                        required />
                                                    <label>Discount Code</label>
                                                </div>

                                                <button className="mui-btn mui-btn--primary disc-btn-wrap" onClick={this.handleRefresh.bind(this)}><i class="material-icons">autorenew</i></button>
                                                <button className="mui-btn mui-btn--primary disc-btn-wrap" onClick={this.handleSearchDiscount.bind(this)}><i class="material-icons">done</i></button>

                                                <div className="DatePicker-wrap large-input">
                                                    <label>Date, when code expired</label>
                                                    <DatePicker
                                                        className="DatePicker"
                                                        selected={moment(this.state.disDB.dateExpired)}
                                                        onChange={this.handleExpDate}
                                                        disabled={!(this.state.disDB.product.length == 0)}
                                                        locale="uk"
                                                    />
                                                </div>
                                            </div>
                                        </form>

                                        <div className="mui-panel">
                                            <form class="mui-form--inline" onSubmit={(e) => this.handleSubmit(e)} >

                                                <div className="mui-textfield large-input marg-right prod-name-main">
                                                    <input list="name" onChange={this.updadeSearch.bind(this)} onSelect={this.handleProdTitle.bind(this)} required />
                                                    <label>Product name</label>
                                                    <datalist id="name">
                                                        {
                                                            this.state.data.map((item, i) => {
                                                                return (<option key={i}>{item.title}</option>)
                                                            })
                                                        }
                                                    </datalist>
                                                </div>

                                                {this.state.mLoading ? (<div class="small-spin"><Spinner /></div>) : (<div class="small-spin"><i class="material-icons">done</i></div>)}

                                                <div className="mui-textfield large-input inprice marg-right">
                                                    <input type="text" value={`$${(this.state.pBefore / 100).toFixed(2)}`} disabled />
                                                    <label>Price before</label>
                                                </div>


                                                <div className="mui-textfield large-input indisc marg-right">
                                                    <input type="number" defaultValue="0" onChange={(e) => { this.handleProdDisc(e) }} min="1" max="99" />
                                                    <label>Discount, %</label>

                                                </div>

                                                <div className="mui-textfield large-input inprice marg-right">
                                                    <input type="text" value={`$${(this.state.pAfter / 100).toFixed(2)}`} disabled />
                                                    <label>Price after</label>
                                                </div>

                                                <button className="mui-btn mui-btn--primary disc-btn-wrap" ><i class="material-icons">done_all</i></button>
                                            </form>
                                        </div>

                                        <div className="mui-panel">
                                            {this.state.disDB.product.map((item, i) =>
                                                <div key={i}>
                                                    <form className="mui-form--inline">

                                                        <div className="mui-textfield large-input marg-right prod-name">
                                                            <input
                                                                value={item.prodTitle}
                                                                disabled />
                                                            <label>Product name</label>
                                                        </div>

                                                        <span className="disc-img"><img src={this.state.arrImg[i]} alt="Failed to load" /></span>


                                                        <div className="mui-textfield large-input inprice marg-right">
                                                            <input type="text" value={`$${((this.state.arrPrBefore[i]) / 100).toFixed(2)}`} disabled />
                                                            <label>Price before</label>
                                                        </div>


                                                        <div className="mui-textfield large-input indisc marg-right">
                                                            <input
                                                                value={item.discount}
                                                                disabled />
                                                            <label>Discount, %</label>
                                                        </div>

                                                        <div className="mui-textfield large-input inprice marg-right">
                                                            <input type="text" value={`$${((this.state.arrPrAfter[i]) / 100).toFixed(2)}`} disabled />
                                                            <label>Price after</label>
                                                        </div>

                                                        <button className="mui-btn mui-btn--danger disc-btn-wrap" value={i} onClick={this.handleDeleteProd.bind(this)}><i class="material-icons">delete_forever</i></button>
                                                    </form>
                                                </div>

                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mui-col-md-1"></div>
                    </div>
                </div>
            </div>

        );
    }
}

