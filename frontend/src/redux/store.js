import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger"; // Correctly import redux-logger
import { thunk } from "redux-thunk"; // Import thunk as a named export
import rootReducer from "./rootReducer"; // Ensure this points to your combined reducers

// Initialize middleware
const middleware = [thunk];

if (process.env.NODE_ENV === "development") {
    const logger = createLogger(); // Initialize logger only in development mode
    middleware.push(logger);
}

// Create the Redux store
const store = createStore(
    rootReducer,
    applyMiddleware(...middleware) // Spread the middleware array
);

export default store;
