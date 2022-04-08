import { useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Logout from "./components/Logout";
import SignUp from "./components/SignUp";
import services from "./services";

function App() {
  useEffect(() => {
    services.auth.getCsrf();
  }, []);
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <About />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/logout">
          <Logout />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
