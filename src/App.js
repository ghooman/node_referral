import { Routes, Route } from 'react-router-dom';
// style
import './App.css';
import './styles/Main.scss'
// Route
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SalesRecord from './pages/SalesRecord';
import RecommenderList from './pages/RecommenderList';
import RefferalEarningList from './pages/RefferalEarningList';
import OtherSalesRecord from './pages/OtherSalesRecord';
import MasterDashboardDoing from './pages/MasterDashboardDoing';
import MasterDashboardDone from './pages/MasterDashboardDone';

function App(){
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/SalesRecord" element={<SalesRecord />} />
        <Route path="/RecommenderList" element={<RecommenderList />} />
        <Route path="/RefferalEarningList" element={<RefferalEarningList />} />
        <Route path="/OtherSalesRecord" element={<OtherSalesRecord />} />
        <Route path="/MasterDashboardDoing" element={<MasterDashboardDoing />} />
        <Route path="/MasterDashboardDone" element={<MasterDashboardDone />} />
      </Routes>
    </div>
  );
}

export default App;