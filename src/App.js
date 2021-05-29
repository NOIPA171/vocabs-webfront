import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import List2 from "pages/List/v2";
import Chart from "pages/Chart";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <h1>Vocab Tool :D</h1>
          <Link to="/">Home</Link>
          <Link to="/chart">Chart</Link>
        </nav>
        <div className="container">
          <Switch>
            <Route path="/chart">
              <Chart />
            </Route>
            <Route path="/">
              <List2 />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
