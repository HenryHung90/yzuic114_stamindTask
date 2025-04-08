import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import {ThemeProvider} from "@material-tailwind/react";
import {BrowserRouter as Router} from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <Router basename={import.meta.env.VITE_APP_BASENAME ?? ""}>
      <div className='bg-gradient-to-l from-stamindTask-primary-blue-200 to-stamindTask-white-150'>
        <App/>
      </div>
    </Router>
  </ThemeProvider>
  ,
);
