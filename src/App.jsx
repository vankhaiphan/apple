import Scene from './components/Scene/Scene';
import LetterView from './components/Letter/LetterView';
import TitleOverlay from './components/UI/TitleOverlay';

function App() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Scene />
      <TitleOverlay />
      <LetterView />
    </div>
  );
}

export default App;
