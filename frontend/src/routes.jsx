import { Home, Layout, Summary, List } from "@/pages";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/summary",
        element: <Summary />,
      },
      {
        path: "/list",
        element: <List />,
      },
    ],
  },
];

export default routes;
