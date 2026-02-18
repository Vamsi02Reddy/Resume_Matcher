import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UploadResume from './pages/UploadResume';
import History from './pages/History';
import Results from './pages/Results';
import Header from './components/Header';
import SkillAnalysisResult from './pages/SkillAnalysisResult';
import PageNotFound from './pages/PageNotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<UploadResume />} />
        <Route path="/history" element={<History />} />
        <Route path="/results/:resultId" element={<Results />} />
        <Route path="/result/:id" element={<SkillAnalysisResult />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;