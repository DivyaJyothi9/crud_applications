// App.js
import React from 'react';
import './App.css';
import Home from './Home';  // Import the Home component
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer/>
      <Home />
    </div>
  );
}

export default App;

