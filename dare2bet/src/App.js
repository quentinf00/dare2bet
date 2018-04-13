import React, { Component } from 'react';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Dare to Bet</h1>
        </header>
        <Game/>
        <p className="App-intro">
        </p>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: ""};
    this.updateName = this.updateName.bind(this);
  }

  updateName(state) {
    this.setState(state);
  }
  render () {
    return (<div>
      <br/>
    <NameForm setName={this.updateName}/>
    </div>)
  }
}

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value:"", playerName:"", results: {everybody_answered:false}};
    this.updateParentState = props.setName
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateResults = this.updateResults.bind(this);
  }

  handleClick(event) {
    this.setState({playerName: ""});
  }


  handleChange(event) {
    this.setState({value: event.target.value});
  }

  updatePlayers(players) {
    console.log("updatePlayers")
    console.log(players)

   this.setState({players: players})
  }

  handleSubmit(event) {
//    alert('A name was submitted: ' + this.state.value);

  this.setState({playerName: event.target.value});
  this.updateParentState(this.state)

  let url = "https://hrwcgjdw3e.execute-api.us-east-1.amazonaws.com/dev/users/create?player_name=" + this.state.value

  fetch(url)
  .then(response => response.json())
  .then(myJson => this.updatePlayers(myJson.players))
  .then(this.updateResults())
  .catch(error => console.error(error));

  event.preventDefault();
  }

  updateResults() {
    console.log("[+] updateResults");
    fetch("https://hrwcgjdw3e.execute-api.us-east-1.amazonaws.com/dev/get_result")
    .then(response => response.json())
    .then(myJson => this.setState({ results: myJson }))
    .catch(error => console.error(error));
  }

    componentDidMount() {
      this.updateResults();
  }


  render() {
    const playerName = this.state.playerName
    if (playerName === "") {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Votre nom :
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <div>{this.state.players}</div>
          <br/>

          <input type="submit" value="Submit" />

        </form>)
    }
    else
    {
      return (
        <div>
        <h2 onClick={this.handleClick}> {this.state.value}</h2>
        <Quiz playerName={this.state.value} updateResult={this.updateResults}/>
        <br/>
            <PlayerList players={this.state.players}/>
            <Results data={this.state.results}/>
        </div>
      )
    }
  }
}

class Results extends React.Component {
  render() {
    console.log(this.props.data)
    if (this.props.data.everybody_answered == false) {
      return (
        <div>
        <h2>Results:</h2>
        <div><b>waiting_for_response :</b>
        {this.props.data.waiting_for_response ? this.props.data.waiting_for_response.map((player, index) => (<div key={index}>{player}</div>)) : null}
        </div>
        <div><b>already_responded :</b>
        {this.props.data.already_responded ? this.props.data.already_responded.map((player, index) => (<div key={index}>{player}</div>)) : null}
        </div>
        </div>
      )
    } else {
      return (
        <div>
        <h2>Results:</h2>
        <div><b>should_drink :</b>
        {this.props.data.should_drink ? this.props.data.should_drink.map((player, index) => (<div key={index}>{player}</div>)) : null}
        </div>
        <div><b>should_not_drink :</b>
        {this.props.data.should_not_drink ? this.props.data.should_not_drink.map((player, index) => (<div key={index}>{player}</div>)) : null}
        </div>
        </div>
      )
    }
    }

  }

class PlayerList extends React.Component {

  render() {
    return (
      <div>
        {this.props.players ? this.props.players.map((player, index) => (<div key={index}>{player}</div>)) : null}
      </div>)
  }
}

class Quiz extends React.Component {
  constructor(props) {
      super(props);
      this.state = {question: "loading", playerName : props.playerName, answered : false};
      this.sayYes = this.sayYes.bind(this);
      this.sayNo = this.sayNo.bind(this);
      this.saySomething = this.saySomething.bind(this);
      this.updateResults = props.updateResult
  }

  componentDidMount() {

    fetch("https://hrwcgjdw3e.execute-api.us-east-1.amazonaws.com/dev/get_question")
    .then(response => response.json())
    .then(myJson => this.setState({ loading: "", question: myJson.question }))
    .catch(error => console.error(error));

}

saySomething(answer) {
  this.setState({answered: true})
  fetch("https://hrwcgjdw3e.execute-api.us-east-1.amazonaws.com/dev/post_answer?player_name=" + this.state.playerName + "&answer=" + answer)
  .then(response => response.json())
  .then(data => this.updateResults())
  .then(myJson => console.log(myJson))
  .catch(error => console.error(error));
}

sayYes(event) {
  console.log("[+] test say yes");
  event.preventDefault();
  this.saySomething("yes");
}

sayNo(event) {
  console.log("[+] test say no");
  event.preventDefault();
  this.saySomething("no");
}

    render() {
        return (
            <div id="quiz">
                <h1>Question : {this.state.question}</h1>
                <button onClick={this.sayYes} disabled={this.state.answered}>
                Oui
                </button>

                <button onClick={this.sayNo}  disabled={this.state.answered}>
                Non
                </button>

            </div>
        );
    }
}


export default App;
