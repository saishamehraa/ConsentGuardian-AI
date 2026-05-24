//src/app/routes.tsx
import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { IssueDetailPage } from "./pages/IssueDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/issue/:id",
    Component: IssueDetailPage,
  },
]);
