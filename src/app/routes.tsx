// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { DashboardLayout } from "./components/DashboardLayout";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardOverview } from "./pages/DashboardOverview";
import { DataFlowPage } from "./pages/DataFlowPage";
import { ComplianceHeatmap } from "./pages/ComplianceHeatmap";
import { CopilotPage } from "./pages/CopilotPage";
import { PullRequestsPage } from "./pages/PullRequestsPage";
import { PredictiveCompliancePage } from "./pages/PredictiveCompliancePage";
import { ReportsPage } from "./pages/ReportsPage";
import { IssueDetailPage } from "./pages/IssueDetailPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "overview", element: <DashboardOverview /> },
      { path: "data-flow", element: <DataFlowPage /> },
      { path: "compliance", element: <ComplianceHeatmap /> },
      { path: "copilot", element: <CopilotPage /> },
      { path: "pull-requests", element: <PullRequestsPage /> },
      { path: "predictive", element: <PredictiveCompliancePage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "issue/:id", element: <IssueDetailPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);