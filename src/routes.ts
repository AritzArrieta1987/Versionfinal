import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { FinancesPage } from "./pages/FinancesPage";
 
export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/finances",
    Component: FinancesPage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);