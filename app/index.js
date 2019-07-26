import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-awesome-modal';
import openSocket from 'socket.io-client';
import './index.css';

var socket;
var universalGameState = {}; //dangerous
var current_id = 1;

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
        var netflix;
        var profile;
        var twitter;
        var insta;
        var amazon;
        var fb;
        if (!(universalGameState["user_data"] === undefined)) {
            var answers = universalGameState["user_data"][this.props.player];
            netflix = answers["netflix"];
            profile = answers["avatar"];
            twitter = answers["twitter"];
            insta = answers["instagram"];
            amazon = answers["amazon"];
            fb = answers["fb"];
            console.log("Player in gb", this.props.player);
        }

        return (
            <div id="gameboard">
                <GridBox color="#FBC9FF" image="../public/img/netflix.png" category="netflix" value={netflix ? netflix : ""}></GridBox>
                <GridBox color="#88E6D8" image="../public/img/profile.png" category="profile" value={profile ? profile : ""}></GridBox>
                <GridBox color="#FFD769" image="../public/img/twitter.png" category="twitter" value={twitter ? twitter : ""}></GridBox>
                <GridBox color="#C0F8B2" image="../public/img/insta.png" category="insta" value={insta ? insta : ""}></GridBox>
                <GridBox color="#A4B0F2" image="../public/img/amazon.png" category="amazon" value={amazon ? amazon : ""}></GridBox>
                <GridBox color="#FFC6C6" image="../public/img/fb.png" category="fb" value={fb ? fb : ""}></GridBox>
            </div>
        )
    }
}
class Playerboard extends React.Component {
    switchBoard(el) {
        console.log(el);
        this.props.callback(el);
        for (var i = 1; i < 7; i++) {
            document.getElementById(i).style.backgroundColor = "#fff";
            document.getElementById(i).style.fontWeight = "normal";
        }
        document.getElementById(el).style.backgroundColor = "#a3a3a3b6";
        document.getElementById(el).style.fontSize = "bold";
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
    likeTraits(gamestate) {
        let likeList = gamestate
        if (likeList !== undefined) {
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
                    {this.likeTraits(this.props.gamestate.likes)}
                </div>
                {/* <div className="title">Recent Activity</div>
                <div id="recent" className="contentDiv">
                    {this.likeTraits()}
                </div> */}
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

// var Parent = React.createClass({
//     getInitialState: function () {
//         return { sidebarOpen: false };
//     },
//     handleViewSidebar: function () {
//         this.setState({ sidebarOpen: !this.state.sidebarOpen });
//     },
//     render: function () {
//         return (
//             <div>
//                 <Header onClick={this.handleViewSidebar} />
//                 <SideBar isOpen={this.state.sidebarOpen} toggleSidebar={this.handleViewSidebar} />
//                 <Content isOpen={this.state.sidebarOpen} />
//             </div>
//         );
//     }
// });

class Parent extends React.Component {
    getInitialState() {
        return { sidebarOpen: false };
    }
    handleViewSidebar() {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }
    render() {
        return (
            <div>
                <Header onClick={this.handleViewSidebar} />
                <SideBar isOpen={this.state.sidebarOpen} toggleSidebar={this.handleViewSidebar} />
                <Content isOpen={this.state.sidebarOpen} />
            </div>
        );
    }
}
// var Header = React.createClass({
//     render: function () {
//         return (
//             <header>
//                 <a href="javascript:;" onClick={this.props.onClick}>Click Me!</a>
//             </header>
//         );
//     }
// });

class Header extends React.Component {
    render() {
        return (
            <header>
                <a href="javascript:;" onClick={this.props.onClick}>Click Me!</a>
            </header>
        );
    }
}

// var SideBar = React.createClass({
//     render: function () {
//         var sidebarClass = this.props.isOpen ? 'sidebar open' : 'sidebar';
//         return (
//             <div className={sidebarClass}>
//                 <div>I slide into view</div>
//                 <div>Me too!</div>
//                 <div>Meee Threeeee!</div>
//                 <button onClick={this.props.toggleSidebar} className="sidebar-toggle">Toggle Sidebar</button>
//             </div>
//         );
//     }
// });

// class SideBar extends React.Component {
//     constructor(props) {
//         super(props);
//         this.render.bind(this)
//         this.sidebarClass = this.props.isOpen ? 'sidebar open' : 'sidebar';
//     }
//     render() {
//         return (
//             <div className={sidebarClass}>
//                 <div>I slide into view</div>
//                 <div>Me too!</div>
//                 <div>Meee Threeeee!</div>
//                 <button onClick={this.props.toggleSidebar} className="sidebar-toggle">Toggle Sidebar</button>
//             </div>
//         );
//     }
// }

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.render.bind(this)
        this.contentClass = this.props.isOpen ? 'content open' : 'content';
    }
    render() {
        return (
            <div className={contentClass}>I am content fill me up!</div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.voteClicked = this.voteClicked.bind(this)
        this.gameStarted = this.gameStarted.bind(this)
        this.updateInputValue = this.updateInputValue.bind(this)
        this.changeGameState = this.changeGameState.bind(this)
        this.playerboardChanged = this.playerboardChanged.bind(this);
        this.game_finished = this.game_finished.bind(this);
        this.state = {
            voteVisible: false,
            finishVisible: false,
            netflixVisible: false,
            profileVisible: false,
            twitterVisible: false,
            instaVisible: false,
            amazonVisible: false,
            fbVisible: false,
            endpoint: "localhost:3000",
            game_state: {},
            inputValue: "",
            id: null,
            role: null,
            player: 1,
            finishedMessage: '',
            finishedMessage2: ''
        }
        socket = openSocket(this.state.endpoint);
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
        this.submitAnswer();
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
        this.submitAnswer();
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
        this.submitAnswer();
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
        this.submitAnswer();
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
        this.submitAnswer();
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
        this.submitAnswer();
    }

    openVoteModal() {
        this.setState({
            voteVisible: true
        });
    }

    closeVoteModal() {
        this.setState({
            voteVisible: false
        });
    }

    openFinishModal(data) {
        var message1;
        var message2;
        if(data.win) {
            message1 = 'You win'; 
            message2 = 'The majority picked Player 1 and the catfish is Player 1'
        }
        else {
            message1 = 'You lose';
            message2 = 'The majority picked Player 2 and the catfish is Player 1'
        }
        this.setState({
            finishVisible: true,
            finishedMessage: message1,
            finishedMessage2: message2
        });
    }

    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value
        });
        console.log(this.state.inputValue);
    }

    gameStarted(result) {
        console.log("socket: game_started");
        console.log(result);
        var id = result.user.id;
        console.log("client id is: " + id);
        current_id = id;
        universalGameState = result.gs;
        this.setState({
            role: result.user.role,
            id: result.user.id,
            game_state: result.gs
        });
        this.selectModal();
    }

    selectModal() {
        switch (this.state.game_state.round) {
            case "avatar":
                this.openProfileModal();
                break;
            case "twitter":
                this.openTwitterModal();
                break;
            case "netflix":
                this.openNetflixModal();
                break;
            case "amazon":
                this.openAmazonModal();
                break;
            case "fb":
                this.openFbModal();
                break;
            case "instagram":
                this.openInstaModal();
                break;
            case "finished":
                break;
            case "vote":
            this.openVoteModal();
                break;
        }
    }

    changeGameState(result) {
        this.setState({
            game_state: result
        });
        console.log("round finished");
        universalGameState = result;
        this.selectModal();
    }
    game_finished(data){
        console.log("WE FINSIHED");
        console.log(data);
        this.openFinishModal(data); //DATA IS HERE ANDREW
    }

    changeGameState(result) {
        this.setState({
            game_state: result
        });
        console.log("round finished");
        universalGameState = result;
        this.selectModal();
    }


    submitAnswer(input) {
        console.log("Submit answer", this.state.game_state);
        this.setState({
            inputValue: ""
        })
        socket.emit('move', { "id": this.state.id, "round": this.state.game_state.round, "answer": this.state.inputValue });
    }

    componentDidMount() {
        console.log("mounted");

        socket.emit('join_game', { keys: 'values' });

        socket.on('game_started', this.gameStarted);

        socket.on('round_finished', this.changeGameState);

        socket.on('game_finished', this.game_finished);  //LOOK HERE ANDREW
    }

    componentWillUnmount() {
        socket.off();
    }

    playerboardChanged(input_player) {
        console.log("playerboardChanged", input_player);
        this.setState({
            player: input_player
        })
    }

    voteClicked(vote){
        console.log(vote);
        socket.emit('vote', vote);
        this.closeVoteModal();
    }

    render() {
        let { game_state } = this.state.game_state;

        var players = [];
        for(var id in [1,2,3,4,5,6]){
            players.push(<button onClick={this.voteClicked.bind(null,id)}>{id}</button>)
        }

        console.log("Game State", this.state.game_state);
        return (
            <div id="largeContainer">
                <div id="container">
                    <Gameboard player={this.state.player}></Gameboard>
                    <Playerboard callback={this.playerboardChanged}></Playerboard>
                </div>
                <div>{game_state}</div>
                {/* <input type="button" value="Open" onClick={() => this.openNetflixModal()} />
                <input type="button" value="Open" onClick={() => this.openProfileModal()} />
                <input type="button" value="Open" onClick={() => this.openTwitterModal()} />
                <input type="button" value="Open" onClick={() => this.openInstaModal()} />
                <input type="button" value="Open" onClick={() => this.openAmazonModal()} />
                <input type="button" value="Open" onClick={() => this.openFbModal()} /> */}
                <Modal visible={this.state.voteVisible} width="600" height="200" display="flex" effect="fadeInUp">
                    <div className="modal">
                        <h1>Who is the catfish?</h1>
                        <ul>{players}</ul>
                    </div>
                </Modal>
                <Modal visible={this.state.finishVisible} width="400" height="200" display="flex" effect="fadeInUp">
                    <div className="modal">
                        <h1>{this.state.finishedMessage}</h1>
                        <h1>{this.state.finishedMessage2}</h1>
                    </div>
                </Modal>
                <Modal visible={this.state.netflixVisible} width="400" height="200" display="flex" effect="fadeInUp">
                    <div className="modal">
                        <h1>What time do you watch Netflix?</h1>
                        <input value={this.state.inputValue} onChange={this.updateInputValue} />
                        <a href="javascript:void(0);" onClick={() => this.closeNetflixModal()}>Submit</a>
                    </div>
                </Modal>
                <Modal visible={this.state.profileVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>What is your profile picture?</h1>
                        <input value={this.state.inputValue} onChange={this.updateInputValue} />
                        <a href="javascript:void(0);" onClick={() => this.closeProfileModal()}>Submit</a>
                    </div>
                </Modal>
                <Modal visible={this.state.twitterVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>What's your Twitter handle?</h1>
                        <input value={this.state.inputValue} onChange={this.updateInputValue} />
                        <a href="javascript:void(0);" onClick={() => this.closeTwitterModal()}>Submit</a>
                    </div>
                </Modal>
                <Modal visible={this.state.instaVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>Which famous person would you follow?</h1>
                        <input value={this.state.inputValue} onChange={this.updateInputValue} />
                        <a href="javascript:void(0);" onClick={() => this.closeInstaModal()}>Submit</a>
                    </div>
                </Modal>
                <Modal visible={this.state.amazonVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>What is on your Amazon wishlist?</h1>
                        <input value={this.state.inputValue} onChange={this.updateInputValue} />
                        <a href="javascript:void(0);" onClick={() => this.closeAmazonModal()}>Submit</a>
                    </div>
                </Modal>
                <Modal className="something" visible={this.state.fbVisible} width="400" height="200" effect="fadeInUp">
                    <div className="modal">
                        <h1>What's your Facebook status?</h1>
                        <input value={this.state.inputValue} onChange={this.updateInputValue} />
                        <a href="javascript:void(0);" onClick={() => this.closeFbModal()}>Submit</a>
                    </div>
                </Modal>
                <div id="slideout">
                    {/* <img src="../public/img/like.png" alt="Likes" /> */}
                    <div id="out">
                        <div id="image">
                            <img id="pic" src="../public/img/output-onlinepngtools.png" alt="Likes" />
                        </div>
                    </div>
                    <div id="slideout_inner">
                        <Sidebar gamestate={this.state.game_state}></Sidebar>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))