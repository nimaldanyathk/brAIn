import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { PhysiX } from './pages/PhysiX';
import { OhmsLaw } from './features/physix/OhmsLaw';
import { VectorAddition } from './features/physix/VectorAddition';
import { NewtonLaws } from './features/physix/NewtonLaws';
import { Momentum } from './features/physix/Momentum';
import { Energy } from './features/physix/Energy';
import { Gravitation } from './features/physix/Gravitation';
import { Chemiverse } from './pages/Chemiverse';
import { MathOdyssey } from './pages/MathOdyssey';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/physix" element={<PhysiX />} />
          <Route path="/physix/ohms-law" element={<OhmsLaw />} />
          <Route path="/physix/vectors" element={<VectorAddition />} />
          <Route path="/physix/newton" element={<NewtonLaws />} />
          <Route path="/physix/momentum" element={<Momentum />} />
          <Route path="/physix/energy" element={<Energy />} />
          <Route path="/physix/gravitation" element={<Gravitation />} />
          <Route path="/chemiverse" element={<Chemiverse />} />
          <Route path="/math" element={<MathOdyssey />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
