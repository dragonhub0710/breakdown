import { Home, Layout, Breakdown, Recording } from "@/pages";

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
        path: "/breakdown/:id",
        element: <Breakdown />,
      },
      {
        path: "/recording",
        element: <Recording />,
      },
    ],
  },
];

export default routes;
