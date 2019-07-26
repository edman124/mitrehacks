import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-awesome-modal';
import openSocket from 'socket.io-client';
const socket = openSocket('ec2-34-207-123-245.compute-1.amazonaws.com:8080');
import './index.css';

class GridBox extends React.Component {
    render() {
        return (
            <div className="grid_box" style={{ backgroundColor: this.props.color }}>
                <div className="thumbnail">
                    <img src={this.props.image}></img>
                    <div id={this.props.category}>
                        {this.props.value}
                    </div>
                </div>
            </div>
        )
    }
}

class Gameboard extends React.Component {
    render() {
        return (
            <div id="gameboard">
                <GridBox color="#FBC9FF" image="../public/img/netflix.png" category="netflix" value="8:00PM"></GridBox>
                <GridBox color="#88E6D8" image="../public/img/profile.png" category="profile"></GridBox>
                <GridBox color="#FFD769" image="../public/img/twitter.png" category="twitter" value="twitter"></GridBox>
                <GridBox color="#C0F8B2" image="../public/img/insta.png" category="insta" value="instagram"></GridBox>
                <GridBox color="#A4B0F2" image="../public/img/amazon.png" category="amazon" value="wishlist"></GridBox>
                <GridBox color="#FFC6C6" image="../public/img/fb.png" category="fb" value="status"></GridBox>
            </div>
        )
    }
}
class Playerboard extends React.Component {
    switchBoard(el) {
        console.log(el);
        for (var i = 1; i < 7; i++) {
            document.getElementById(i).style.backgroundColor = "#fff";
            document.getElementById(i).style.fontSize = "14px";
            document.getElementById(i).style.fontWeight = "bold";
        }
        document.getElementById(el).style.backgroundColor = "#a3a3a3b6";
        document.getElementById(el).style.fontSize = "18px";
        // Switch information on boards with info of player with id el
    }
    render() {
        return (
            <div id="playerboard">
                <div className="player" id="1" onClick={this.switchBoard.bind(this, 1)}>Player 1</div>
                <div className="player" id="2" onClick={this.switchBoard.bind(this, 2)}>Player 2</div>
                <div className="player" id="3" onClick={this.switchBoard.bind(this, 3)}>Player 3</div>
                <div className="player" id="4" onClick={this.switchBoard.bind(this, 4)}>Player 4</div>
                <div className="player" id="5" onClick={this.switchBoard.bind(this, 5)}>Player 5</div>
                <div className="player" id="6" onClick={this.switchBoard.bind(this, 6)}>Player 6</div>
            </div>
        )
    }
}

class Sidebar extends React.Component {
    render() {
        return (
            <div id="sidebar">
                &#x2329;
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            netflixVisible: false,
            profileVisible: false,
            twitterVisible: false,
            instaVisible: false,
            amazonVisible: false,
            fbVisible: false
        }
    }

    startGame() {

    }

    openNetflixModal() {
        this.setState({
            netflixVisible: true
        });
    }

    closeNetflixModal() {
        this.setState({
            netflixVisible: false
        });
    }
    openProfileModal() {
        this.setState({
            profileVisible: true
        });
    }

    closeProfileModal() {
        this.setState({
            profileVisible: false
        });
    }
    openTwitterModal() {
        this.setState({
            twitterVisible: true
        });
    }

    closeTwitterModal() {
        this.setState({
            twitterVisible: false
        });
    }
    openInstaModal() {
        this.setState({
            instaVisible: true
        });
    }

    closeInstaModal() {
        this.setState({
            instaVisible: false
        });
    }
    openAmazonModal() {
        this.setState({
            amazonVisible: true
        });
    }

    closeAmazonModal() {
        this.setState({
            amazonVisible: false
        });
    }
    openFbModal() {
        this.setState({
            fbVisible: true
        });
    }

    closeFbModal() {
        this.setState({
            fbVisible: false
        });
    }
    render() {
        console.log('cool');
        var temp = "cool";
        return (
            <div>
                <div id="container">
                    <Gameboard></Gameboard>
                    <Playerboard></Playerboard>
                </div>
                <Sidebar></Sidebar>
                <div></div>
                <input type="button" value="Open" onClick={() => this.openNetflixModal()} />
                <input type="button" value="Open" onClick={() => this.openProfileModal()} />
                <input type="button" value="Open" onClick={() => this.openTwitterModal()} />
                <input type="button" value="Open" onClick={() => this.openInstaModal()} />
                <input type="button" value="Open" onClick={() => this.openAmazonModal()} />
                <input type="button" value="Open" onClick={() => this.openFbModal()} />
                <Modal visible={this.state.netflixVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>What time do you watch Netflix?</h1>
                        <input />
                        <a href="javascript:void(0);" onClick={() => this.closeNetflixModal()}>Submit</a>
                    </div>
                </Modal>
                <Modal visible={this.state.profileVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>What is your profile picture?</h1>
                        <input />
                        <p>Some Contents</p>
                        <a href="javascript:void(0);" onClick={() => this.closeProfileModal()}>Close</a>
                    </div>
                </Modal>
                <Modal visible={this.state.twitterVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>What's your Twitter handle?</h1>
                        <input />
                        <a href="javascript:void(0);" onClick={() => this.closeTwitterModal()}>Submit</a>
                    </div>
                </Modal>
                <Modal visible={this.state.instaVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>Which famous person would you follow?</h1>
                        <input />
                        <a href="javascript:void(0);" onClick={() => this.closeInstaModal()}>Submit</a>
                    </div>
                </Modal>
                <Modal visible={this.state.amazonVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>What is on your Amazon wishlist?</h1>
                        <input />
                        <a href="javascript:void(0);" onClick={() => this.closeAmazonModal()}>Submit</a>
                    </div>
                </Modal>
                <Modal visible={this.state.fbVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>What's your Facebook status?</h1>
                        <input />
                        <a href="javascript:void(0);" onClick={() => this.closeFbModal()}>Submit</a>
                    </div>
                </Modal>

            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))