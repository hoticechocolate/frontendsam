import DashboardPage from "@/pages/DashboardPage"
import ModelPerformancePage from "@/pages/ModelPerformancePage"
import { useHashRoute } from "@/hooks/useHashRoute"

export default function App() {
  const route = useHashRoute()
  return route === "model" ? <ModelPerformancePage /> : <DashboardPage />
}
