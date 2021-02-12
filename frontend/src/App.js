import React from "react";
import axios from './axiosConfig';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      csrf: "",
      username: "",
      password: "",
      error: "",
      isAuthenticated: false,
    };
  }

  componentDidMount = () => {
    this.getSession();
  }

  getCSRF = () => {
    axios.get('api/csrf/')
      .then((res) => {
        // Should get from cookie
        let csrfToken = res.headers["x-csrftoken"];
        this.setState({csrf: csrfToken});
        console.log('CSRF: ' + csrfToken);
      })
      .catch(err => console.log(err))
  }

  getSession = () => {
    axios.get("/api/session/")
    .then((res) => {
      console.log(res);
      if (res.data.isAuthenticated) {
        this.setState({isAuthenticated: true});
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 403) {
        this.setState({isAuthenticated: false});
        this.getCSRF();
      }
    });
  }

  whoami = () => {
    axios.get("/api/whoami/")
    .then((res) => {
      console.log("You are logged in as: " + res.data.username);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handlePasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  handleUserNameChange = (event) => {
    this.setState({username: event.target.value});
  }

  login = (event) => {
    event.preventDefault();
    axios.post("/api/login/",
      {username: this.state.username, password: this.state.password},
      {
        headers: {
          'X-CSRFToken': this.state.csrf
        }
      }
    )
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated: true, username: "", password: "", error: ""});
    })
    .catch((err) => {
      console.log(err);
      this.setState({error: "Wrong username or password."});
    });
  }

  logout = () => {
    axios.get("/api/logout")
    .then(this.isResponseOk)
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated: false});
      this.getCSRF();
    })
    .catch((err) => {
      console.log(err);
    });
  };

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div className="container mt-3">
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form onSubmit={this.login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={this.handleUserNameChange} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
              <div>
                {this.state.error &&
                  <small className="text-danger">
                    {this.state.error}
                  </small>
                }
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      );
    }
    return (
      <div className="container mt-3">
        <h1>React Cookie Auth</h1>
        <p>You are logged in!</p>
        <button className="btn btn-primary mr-2" onClick={this.whoami}>WhoAmI</button>
        <button className="btn btn-danger" onClick={this.logout}>Log out</button>
      </div>
    )
  }
}

export default App;