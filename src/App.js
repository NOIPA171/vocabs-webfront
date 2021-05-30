import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import List2 from "pages/List/v2";
import Chart from "pages/Chart";
import Navbar from "components/Navbar";
import GoToTop from "components/GoToTop";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <GoToTop />
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
