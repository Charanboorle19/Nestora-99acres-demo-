import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import ShortlistPage from './pages/ShortlistPage'
import SavedSearchesPage from './pages/SavedSearchesPage'
import BuyerDashboardPage from './pages/BuyerDashboardPage'
import EmiCalculatorPage from './pages/EmiCalculatorPage'
import LoanEligibilityPage from './pages/LoanEligibilityPage'
import PostPropertyPage from './pages/PostPropertyPage'
import SellerDashboardPage from './pages/SellerDashboardPage'
import ProjectPage from './pages/ProjectPage'
import BuilderProfilePage from './pages/BuilderProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="property/:id" element={<PropertyDetailPage />} />
          <Route path="shortlist" element={<ShortlistPage />} />
          <Route path="saved-searches" element={<SavedSearchesPage />} />
          <Route path="dashboard" element={<BuyerDashboardPage />} />
          <Route path="tools/emi" element={<EmiCalculatorPage />} />
          <Route path="tools/loan-eligibility" element={<LoanEligibilityPage />} />
          <Route path="post-property" element={<PostPropertyPage />} />
          <Route path="seller/*" element={<SellerDashboardPage />} />
          <Route path="project/:slug" element={<ProjectPage />} />
          <Route path="builder/:slug" element={<BuilderProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
