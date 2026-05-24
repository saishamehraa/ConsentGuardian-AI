// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom"; // <--- CHANGE THIS
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { IssueDetailPage } from "./pages/IssueDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/issue/:id",
    element: <IssueDetailPage />,
  },
]);