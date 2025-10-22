"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("react-dom/client");
var App_tsx_1 = require("./App.tsx");
var react_redux_1 = require("react-redux");
var store_1 = require("@/redux/store");
require("./index.css");
(0, client_1.createRoot)(document.getElementById("root")).render(<react_redux_1.Provider store={store_1.store}>
    <App_tsx_1.default />
  </react_redux_1.Provider>);
