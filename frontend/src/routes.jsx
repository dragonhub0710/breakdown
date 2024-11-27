import { Home, Layout, Breakdown, Recording, SignIn } from "@/pages";

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
  {
    path: "/signin",
    element: <SignIn />,
  },
];

export default routes;
