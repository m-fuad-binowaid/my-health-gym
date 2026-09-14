import { createRoot } from "react-dom/client";
import { Route, Router, Switch } from "wouter";

import App from "./App";
import AdminApp from "./AdminApp";
import { ErrorBoundary } from "@/components/error-boundary";

import "./index.css";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <Router base={basePath}>
      <Switch>
        <Route path="/admin" component={AdminApp} />
        <Route path="/" component={App} />
        <Route component={App} />
      </Switch>
    </Router>
  </ErrorBoundary>,
);
