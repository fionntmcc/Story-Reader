import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Browse from './components/Browse';
import Read from './components/Read';
import Write from './components/Write';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Update from './components/Update';
import Footer from "./components/Footer";

import Upload from "./components/Upload";

function App() {
  return (
    <div id="app" data-theme="dark">
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/read/:id" element={<Read />} />
          <Route path="/write" element={<Write />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="/file/upload" element={<Upload />} />
        </Routes>
      </Router>
      <Footer></Footer>
    </div>

  );
}

export default App;
