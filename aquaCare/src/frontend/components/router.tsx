import { createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import Layout from "./Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: routes,
  },
]);
