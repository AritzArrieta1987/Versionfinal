import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { FinancesPage } from "./pages/FinancesPage";
import { ArtistPortalPage } from "./pages/ArtistPortalPage";
 
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
    path: "/artist/:artistId",
    Component: ArtistPortalPage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);