import './App.css';
import { Tetris } from './tetris/components/Tetris';

function App() {
  return (
    <div className="d-flex flex-row vh-100 w-100">
      <div className="d-flex flex-column w-100">
        <div className='d-flex flex-row justify-content-center'>
          <h1>Tetris</h1>
        </div>

        <hr />
        <div
          className='d-flex justify-content-center align-items-center h-100 tetris'
        >
          <Tetris />
        </div>
      </div>
    </div>
  );
}

export default App;
