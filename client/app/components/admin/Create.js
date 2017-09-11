import React from 'react';
import axios from 'axios';
import TagsInput from 'react-tagsinput';
import NumberFormat from 'react-number-format';
import { browserHistory, Link, hashHistory } from 'react-router';

import './css/Create.css';

import Spinner from './Spinner';

export default class Create extends React.Component {
    constructor() {
        super();
        this.state = {
            file: '',
            data: { properties: [], tags: [], img: [] },
            loading: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTag = this.handleTag.bind(this);
        this.handleImg = this.handleImg.bind(this);
        this.handleAddProp = this.handleAddProp.bind(this);
        this.handleDeleteProp = this.handleDeleteProp.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleChange(e, stateItem) {
        e.preventDefault();
        var data = this.state.data;
        data[stateItem] = e.target.value;
    }

    handleTag(tags) {
        this.state.data.tags = tags
        this.setState({ tags });
    }

    handleImg(img) {
        this.state.data.img = img
        this.setState({ img });
    }

    handleAddProp(e) {
        e.preventDefault();
        var that = this;
        var data = this.state.data;

        //всем костылям костыль начало
        var n = this.state.data.name;
        var v = this.state.data.value;
        if (n === undefined || "") { }
        else if (v === undefined || "") { }
        else {
            var ss = data.name.trim()
            var pp = data.value.trim()
            var obj = { name: ss, value: pp };

            if (data.properties.length == 0)
            { var qq = true }
            else
            { var s = data.properties.length - 1; qq = (data.properties[s].name !== ss) }
            //всем костылям костыль конец
            if (qq) {
                data.properties.push(obj)
                if (this.props.location.state) {
                    axios.put('/admin/product/' + this.props.location.state, {
                        title: data.title,
                        desc: data.desc,
                        price: data.price.toString().replace(/[\. ,:-]+/g, ""),
                        tags: data.tags,
                        img: data.img,
                        properties: data.properties,
                        accessible: this.state.accessible || false,
                    })
                        .then(response => {
                            that.setState({ loading: true }, () => {
                                that.componentWillMount();
                            });
                        })
                        .catch(error => 
                            console.log(error)
                        );
                }
                else {
                    axios.post('/admin/product', {
                        title: data.title,
                        desc: data.desc,
                        price: data.price.toString().replace(/[\. ,:-]+/g, ""),
                        tags: data.tags,
                        img: data.img,
                        properties: data.properties,
                        accessible: this.state.accessible || false,

                    })
                        .then(response => {
                            browserHistory.push({
                                pathname: '/admin/create',
                                state: response.data._id
                            });
                            that.setState({ loading: true }, () => {
                                that.componentWillMount();
                            });
                        })
                        .catch(error =>
                            console.log(error)
                        );
                }
            }
        }
    }

    handleDeleteProp(e) {
        e.preventDefault();
        var index = e.target.value;
        var data = this.state.data;
        var arr = data.properties;
        var that = this;
        arr.splice(index, 1);
        this.setState({ properties: arr });
        axios.put('/admin/product/' + this.props.location.state, {
            title: data.title,
            desc: data.desc,
            price: data.price.toString().replace(/[\. ,:-]+/g, ""),
            tags: data.tags,
            img: data.img,
            properties: data.properties,
            accessible: this.state.accessible || false,
        })
            .then(response =>
                that.setState({ loading: true }, () => {
                    that.componentWillMount()}
                )
            )
            .catch(error =>
                console.log(error)
            );
    }

    handleOptionChange(e) {
        this.setState({ accessible: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault();
        var data = this.state.data;
        if (this.props.location.state) {
            axios.put('/admin/product/' + this.props.location.state, {
                title: data.title,
                desc: data.desc,
                price: data.price.toString().replace(/[\. ,:-]+/g, ""),
                tags: data.tags,
                img: data.img,
                properties: data.properties,
                accessible: this.state.accessible || false,
            })
                .then(response => 
                    browserHistory.push("/admin/list")
                )
                .catch(error =>
                    console.log(error)
                );
        }
        else {
            axios.post('/admin/product', {
                title: data.title,
                desc: data.desc,
                price: data.price.toString().replace(/[\. ,:-]+/g, ""),
                tags: data.tags,
                img: data.img,
                properties: data.properties,
                accessible: this.state.accessible || false,
            })
                .then(response =>
                    browserHistory.push("admin/list")
                )
                .catch(error =>
                    console.log(error)
                );
        }
    }

    handleFileChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: reader.result,
            });
        }
        reader.readAsDataURL(file)
    }

    handleFile(e) {
        e.preventDefault();
        var that = this;
        if (!!this.state.file) {
            axios.post('/admin/product/file', {
                title: this.state.data.title,
                file: this.state.file
            })
                .then((response) => {
                    var img = that.state.data.img
                    that.state.data.img = img.concat(response.data)
                    that.setState({ img, file: '' })
                    document.getElementById("Upload").reset(); //hardcode??
                }).catch(error =>
                    console.log(error)
                );
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

        if (this.props.location.state) {
            axios.get('/admin/product/' + this.props.location.state)
                .then(response => {
                    this.setState({ file: '', data: response.data, loading: false })
                });
        }
        else {
            this.setState({ file: '', data: { properties: [], tags: [], img: [], accessible: false }, loading: false });
        }
    }

    render() {
        var data = this.state.data;
        var prop = this.state.data.properties;
        return (

            <div>
                <div className="mui-container">
                    <div className="mui-row">
                        <div className="mui-col-md-1"></div>
                        <div className="mui-col-md-10">
                            <div className="mui-panel admin-miu-panel">
                                {this.state.loading ? (<div className="mui--text-center"><Spinner /></div>) : (

                                    <form className="mui-form" onSubmit={this.handleSubmit}>

                                        <div className="mui-textfield large-input">
                                            <input
                                                defaultValue={data.title}
                                                onChange={(e) => { this.handleChange(e, "title") }}
                                                pattern="^.{0,50}$"
                                                required />
                                            <label>Title</label>
                                        </div>

                                        <div className="mui-textfield large-input text-area">
                                            <textarea
                                                className="text-area"
                                                type="textarea"
                                                name="desc"
                                                defaultValue={data.desc}
                                                onChange={(e) => { this.handleChange(e, "desc") }}
                                                pattern="^.{0,300}$"
                                                required />
                                            <label>Description</label>
                                        </div>

                                        <div className="mui-textfield large-input">
                                            <NumberFormat
                                                displayType="input"
                                                thousandSeparator=" "
                                                decimalSeparator="."
                                                decimalPrecision="2"
                                                allowNegative='false'
                                                pattern="^.{0,15}$"
                                                type="text"
                                                name="price"
                                                value={(data.price / 100).toFixed(2)}
                                                onChange={(e) => { this.handleChange(e, "price") }}
                                                required />
                                            <label>Price, $</label>
                                        </div>

                                        <div className="mui--text-subhead mui--text-center">Search tags:</div>
                                        <TagsInput
                                            value={data.tags}
                                            onChange={this.handleTag}
                                            onlyUnique={true} />

                                        <div className="mui--text-subhead mui--text-center">Images:</div>
                                        <TagsInput
                                            value={data.img}
                                            onChange={this.handleImg}
                                            validationRegex={/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/}
                                            onValidationReject={() => { return console.log("not valid!") }}
                                            onlyUnique={true} />



                                        <form id="Upload">
                                            <input className="fileInput"
                                                type="file"
                                                value={this.state.filee}
                                                onChange={(e) => this.handleFileChange(e)} />
                                            <button className="mui-btn mui-btn--primary key-S3"
                                                type="submit"
                                                onClick={(e) => this.handleFile(e)}>Upload Image to S3</button>
                                        </form>



                                        <div className="mui--text-subhead mui--text-center">Loaded images:</div>
                                        <div className="mui-panel img-block">
                                            {data.img.map((item, i) =>
                                                <div key={i} className="img-block-item">
                                                    <img src={item} alt="Failed to load image. Try to change url" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mui--text-subhead mui--text-center">Key Features and Benefits:</div>
                                        <div className="mui-panel">
                                            {prop.map((item, i) =>
                                                <div key={i}>
                                                    <form className="mui-form--inline">

                                                        <div className="mui-textfield large-input">
                                                            <input
                                                                className="key-name"
                                                                type="text"
                                                                name="name"
                                                                value={item.name}
                                                                disabled />
                                                            <label>Property name:</label>
                                                        </div>

                                                        <div className="mui-textfield large-input">
                                                            <input
                                                                className="key-value"
                                                                type="text"
                                                                name="value"
                                                                value={item.value}
                                                                disabled />
                                                            <label>Property value:</label>
                                                        </div>

                                                        <button className="mui-btn mui-btn--danger key-btn" value={i} onClick={this.handleDeleteProp}>Delete key</button>
                                                    </form>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mui--text-subhead mui--text-center">Add new feature:</div>
                                        <div className="mui-panel">
                                            <form className="mui-form--inline">
                                                <div className="mui-textfield large-input">
                                                    <input
                                                        className="key-name"
                                                        type="text"
                                                        name="name"
                                                        defaultValue={prop.name}
                                                        onChange={(e) => { this.handleChange(e, "name") }} />
                                                    <label>Property name:</label>
                                                </div>

                                                <div className="mui-textfield large-input">
                                                    <input
                                                        className="key-value"
                                                        type="text"
                                                        name="value"
                                                        defaultValue={prop.value}
                                                        onChange={(e) => { this.handleChange(e, "value") }} />
                                                    <label>Property value:</label>
                                                </div>

                                                <button className="mui-btn mui-btn--primary key-btn" onClick={this.handleAddProp}>Add new</button>
                                            </form>
                                        </div>

                                        <div className="mui-row">
                                            <div className="mui-col-md-2">
                                                <div className="switch">
                                                    <div className="mui--text-subhea mui--text-center">Avalible in shop</div>
                                                    <div className="btn-switch">

                                                        <input id="yes"
                                                            className="btn-switch__radio btn-switch__radio_yes"
                                                            type="radio"
                                                            name="accessible"
                                                            defaultValue={data.accessible}
                                                            defaultChecked={data.accessible == true}
                                                            value="true"
                                                            onClick={this.handleOptionChange} />

                                                        <input id="no"
                                                            className="btn-switch__radio btn-switch__radio_no"
                                                            type="radio"
                                                            name="accessible"
                                                            defaultValue={data.accessible}
                                                            defaultChecked={data.accessible == false}
                                                            value="false"
                                                            onClick={this.handleOptionChange} />
                                                        <label for="yes" className="btn-switch__label btn-switch__label_yes">
                                                            <span className="btn-switch__txt">YES</span>
                                                        </label>

                                                        <label for="no" className="btn-switch__label btn-switch__label_no">
                                                            <span className="btn-switch__txt">NO</span>
                                                        </label>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mui-col-md-10">
                                                <button className="mui-btn mui-btn--large mui-btn--primary mui-btn--raised submit-btn" type="submit" value="Add new!" >Submit!</button>
                                            </div>
                                        </div>

                                    </form>)}
                            </div>
                        </div>
                        <div className="mui-col-md-1"></div>
                    </div>
                </div>
            </div>

        );
    }
}

