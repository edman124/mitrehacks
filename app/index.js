import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class GridBox extends React.Component {
    render() {
        return (
            <div className="grid_box" style={{ backgroundColor: this.props.color }}>
                {this.props.color}
            </div>
        )
    }
}

class Gameboard extends React.Component {
    render() {
        return (
            <div id="gameboard">
                <GridBox color="#FBC9FF"></GridBox>
                <GridBox color="#88E6D8"></GridBox>
                <GridBox color="#FFD769"></GridBox>
                <GridBox color="#C0F8B2"></GridBox>
                <GridBox color="#A4B0F2"></GridBox>
                <GridBox color="#FFC6C6"></GridBox>
            </div>
        )
    }
}

class Playerboard extends React.Component {
    render() {
        return (
            <div id="playerboard">
                <div className="player">
                    Player
                </div>
                <div className="player">
                    Player
                </div>
                <div className="player">
                    Player
                </div>
                <div className="player">
                    Player
                </div>
                <div className="player">
                    Player
                </div>
                <div className="player">
                    Player
                </div>
            </div>
        )
    }
}

class Sidebar extends React.Component {
    likeTraits() {
        let likeList = ['Starbucks', 'CNN', 'Rap', 'Anime', 'Hamburgers']
        let likeComp = []
        let rowDiv = []
        for (var i = 0; i < likeList.length; i++) {
            rowDiv.push(<div className="trait">{likeList[i]}</div>)
            if (i % 2 == 1) {
                likeComp.push(<div className="traitRow">{rowDiv}</div>)
                rowDiv = []
            }
        }
        if (rowDiv) {
            // rowDiv.push(<div className="trait"></div>)
            likeComp.push(<div className="traitRow">{rowDiv}</div>)
        }
        return likeComp
    }
    // recentActivity() {
    //     let dislikeList = ['School', 'Work', 'Pop', 'Fox News']
    //     let dislikeComp = []
    //     for (var i = 0; i < dislikeList.length; i++) {
    //         dislikeComp.push(<div className="trait">{dislikeList[i]}</div>)
    //     }
    //     return dislikeComp
    // }
    render() {
        return (
            <div id="sidebarContent">
                <div className="title">Likes</div>
                <div id="likesDiv" className="contentDiv">
                    {this.likeTraits()}
                </div>
                <div className="title">Recent Activity</div>
                <div id="recent" className="contentDiv">
                    {this.likeTraits()}
                </div>
            </div>
        )
    }
}

class Collapsible extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.togglePanel = this.togglePanel.bind(this);
    }
    togglePanel(e) {
        this.setState({ open: !this.state.open })
    }
    render() {
        return (<div>
            <div onClick={(e) => this.togglePanel(e)} className='sidebar'>
                {this.props.title}</div>
            {
                this.state.open ? (
                    <div className='content'>
                        <Sidebar></Sidebar>
                    </div>
                ) : null
            }
        </div >);
    }
}

class App extends React.Component {
    render() {
        return (
            <div id="container">
                <div id="boardContainer">
                    <Gameboard></Gameboard>
                    <Playerboard></Playerboard>
                </div>
                <Sidebar></Sidebar>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))