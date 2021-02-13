import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import RoomList from "./components/views/Room/RoomList";
import CreatePage from "./components/views/Room/CreatePage";
import Room from "./components/views/Room/Room";
import NavBar from "./components/views/NavBar/NavBar";
import Auth from './hoc/auth';

function App() {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/start" component={LandingPage}/>
          <Route exact path="/"  component={LoginPage}/>
          <Route exact path="/register" component={RegisterPage}/>
          <Route exact path="/list" component={RoomList}/>
          <Route exact path="/create" component={CreatePage}/>
          <Route exact path="/join" component={Room}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App
