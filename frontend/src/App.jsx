import { BrowserRouter, Route, Routes } from "react-router-dom";
import TodayPage from "./pages/TodayPage";
import AddProblemPage from "./pages/AddProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodayPage />} />
        <Route path="/add" element={<AddProblemPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
