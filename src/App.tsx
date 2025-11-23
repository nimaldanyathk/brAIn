import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { PhysiX } from './pages/PhysiX';
import { OhmsLaw } from './features/physix/OhmsLaw';
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
          <Route path="/chemiverse" element={<Chemiverse />} />
          <Route path="/math" element={<MathOdyssey />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
