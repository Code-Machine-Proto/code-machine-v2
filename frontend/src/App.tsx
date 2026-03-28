import { Router, Route } from "@solidjs/router";
import Home from "./pages/Home";
import Workspace from "./pages/Workspace";

export default function App() {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/processor/:id" component={Workspace} />
    </Router>
  );
}
