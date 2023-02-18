import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Hello from './components/Hello';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hello />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
