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
    <NameForm setName={this.updateName}/>
    <div>
      {JSON.stringify(this.state.value)}
    </div>
    </div>)
  }
}

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value:"", playerName:""};
    this.updateParentState = props.setName
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
  this.updateParentState(this.state)

  let url = "https://hrwcgjdw3e.execute-api.us-east-1.amazonaws.com/dev/users/create?player_name=" + this.state.value
  console.log(event.target.value)
  console.log(url)

  fetch(url)
  .then(response => response.json())
  .then(myJson => console.log(myJson))
  .catch(error => console.error(error));

  event.preventDefault();
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
          <input type="submit" value="Submit" />
        </form>)
    }
    else
    {
      return (
        <div>
        <h2 onClick={this.handleClick}> {this.state.value}</h2>
        <Quiz/>
        </div>
      )
    }
  }
}

class Quiz extends React.Component {
  constructor(props) {
      super(props);
      this.state = {question: "loading"};
  }

  componentDidMount() {
    /*
    fetch("http://xxx:8080/")
    .then(response => response.json())
    .then(myJson => this.setState({ loading: "", question: myJson.question }))
    .catch(error => console.error(error));
    */
}

sayYes(event) {
  console.log("test say yes");
  event.preventDefault();
/*
  fetch("http://xxx:8080/")
  .then(response => response.json())
  .then(myJson => this.setState({ }))
  .catch(error => console.error(error));
*/
}

sayNo(event) {
  console.log("test say no");
  event.preventDefault();

/*
  fetch("http://xxx:8080/")
  .then(response => response.json())
  .then(myJson => this.setState({ }))
  .catch(error => console.error(error));
  */
}

    render() {
        return (
            <div id="quiz">
                <h1>Question : {this.state.question}</h1>
                <button onClick={this.sayYes}>
                Oui
                </button>

                <button onClick={this.sayNo}>
                Non
                </button>

            </div>
        );
    }
}


export default App;
