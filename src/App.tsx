import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { PhysiX } from './pages/PhysiX';
import { OhmsLaw } from './features/physix/OhmsLaw';
import { VectorAddition } from './features/physix/VectorAddition';
import { NewtonLaws } from './features/physix/NewtonLaws';
import { Momentum } from './features/physix/Momentum';
import { Energy } from './features/physix/Energy';
import { Gravitation } from './features/physix/Gravitation';
import { MathOdyssey } from './pages/MathOdyssey';
import { Chemiverse } from './pages/Chemiverse';
import { RayOptics } from './pages/RayOptics';
import { Login } from './pages/Login';
import { ProjectileMotion } from './pages/ProjectileMotion';
import { supabase } from './lib/supabase';

// Chemiverse Modules
import { AtomicStructure } from './features/chemiverse/AtomicStructure';
import { PeriodicTable } from './features/chemiverse/PeriodicTable';
import { ChemicalBonding } from './features/chemiverse/ChemicalBonding';
import { StatesOfMatter } from './features/chemiverse/StatesOfMatter';
import { ChemicalReactions } from './features/chemiverse/ChemicalReactions';
import { CombustionFlame } from './features/chemiverse/CombustionFlame';
import { CrystalStructures } from './features/chemiverse/CrystalStructures';
import { Electrochemistry } from './features/chemiverse/Electrochemistry';
import { OrganicMolecules } from './features/chemiverse/OrganicMolecules';
import { Polymers } from './features/chemiverse/Polymers';
import { EnvironmentalChemistry } from './features/chemiverse/EnvironmentalChemistry';
import { MoleculeViewer } from './features/chemiverse/MoleculeViewer';

// Protected Route Component
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check for Demo Session first
    const demoSession = localStorage.getItem('demo_session');
    if (demoSession) {
      setSession({ user: { email: 'demo@brain.app' } }); // Mock session object
      setLoading(false);
      return;
    }

    // Check Supabase Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center bg-surface-gray'>
        <div className='w-8 h-8 border-4 border-brand-black border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (!session) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />

          {/* Protected Routes */}
          <Route path='physix' element={
            <AuthGuard>
              <PhysiX />
            </AuthGuard>
          } />
          <Route path='physix/ohms-law' element={
            <AuthGuard>
              <OhmsLaw />
            </AuthGuard>
          } />
          <Route path='physix/vectors' element={
            <AuthGuard>
              <VectorAddition />
            </AuthGuard>
          } />
          <Route path='physix/newton' element={
            <AuthGuard>
              <NewtonLaws />
            </AuthGuard>
          } />
          <Route path='physix/momentum' element={
            <AuthGuard>
              <Momentum />
            </AuthGuard>
          } />
          <Route path='physix/energy' element={
            <AuthGuard>
              <Energy />
            </AuthGuard>
          } />
          <Route path='physix/gravitation' element={
            <AuthGuard>
              <Gravitation />
            </AuthGuard>
          } />
          <Route path='physix/optics' element={
            <AuthGuard>
              <RayOptics />
            </AuthGuard>
          } />
          <Route path='physix/motion' element={
            <AuthGuard>
              <ProjectileMotion />
            </AuthGuard>
          } />

          <Route path='math' element={
            <AuthGuard>
              <MathOdyssey />
            </AuthGuard>
          } />

          <Route path='chemistry' element={
            <AuthGuard>
              <Chemiverse />
            </AuthGuard>
          } />
          <Route path='chemistry/atomic' element={
            <AuthGuard>
              <AtomicStructure />
            </AuthGuard>
          } />
          <Route path='chemistry/periodic' element={
            <AuthGuard>
              <PeriodicTable />
            </AuthGuard>
          } />
          <Route path='chemistry/bonding' element={
            <AuthGuard>
              <ChemicalBonding />
            </AuthGuard>
          } />
          <Route path='chemistry/states' element={
            <AuthGuard>
              <StatesOfMatter />
            </AuthGuard>
          } />
          <Route path='chemistry/reactions' element={
            <AuthGuard>
              <ChemicalReactions />
            </AuthGuard>
          } />
          <Route path='chemistry/combustion' element={
            <AuthGuard>
              <CombustionFlame />
            </AuthGuard>
          } />
          <Route path='chemistry/crystals' element={
            <AuthGuard>
              <CrystalStructures />
            </AuthGuard>
          } />
          <Route path='chemistry/electro' element={
            <AuthGuard>
              <Electrochemistry />
            </AuthGuard>
          } />
          <Route path='chemistry/organic' element={
            <AuthGuard>
              <OrganicMolecules />
            </AuthGuard>
          } />
          <Route path='chemistry/polymers' element={
            <AuthGuard>
              <Polymers />
            </AuthGuard>
          } />
          <Route path='chemistry/environmental' element={
            <AuthGuard>
              <EnvironmentalChemistry />
            </AuthGuard>
          } />
          <Route path='chemistry/molecules' element={
            <AuthGuard>
              <MoleculeViewer />
            </AuthGuard>
          } />
        </Route>

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
}

export default App;
