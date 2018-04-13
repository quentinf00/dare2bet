import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';



class App extends Component {

//  submitName = (data) => {
  //  console.log(data)
//  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Dare to Bet</h1>
        </header>
        <NameForm/>
        <p className="App-intro">
          Lets go {}.
        </p>
      </div>
    );
  }
}

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', playerName: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

      this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.setState({playerName: ""});
  }


  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
//    alert('A name was submitted: ' + this.state.value);
  this.setState({playerName: event.target.value});
    event.preventDefault();
  }


  render() {
    console.log(this.state.value)
    const playerName = this.state.playerName
    if (playerName == "") {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Votre nom :
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>)
    }
    else
    {
      return (<h2 onClick={this.handleClick}> {this.state.value}</h2>)
    }
  }
}
const Greeting = (props) => (
  <div>{props.toto}</div>
)


export default App;
