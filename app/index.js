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

class App extends React.Component {
    render() {
        return (
            <div id="container">
                <Gameboard></Gameboard>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))