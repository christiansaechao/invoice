import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/layouts/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { PricingPage } from "./pages/PricingPage";
import { LoginForm } from "./components/authentication/login-form";
import { SignUpForm } from "./components/authentication/sign-up-form";
import { ForgotPasswordForm } from "./components/authentication/forgot-password-form";
import { UpdatePasswordForm } from "./components/authentication/update-password-form";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { DashboardHome } from "./pages/DashboardHome";
import { NewInvoice } from "./pages/NewInvoice";
import Invoices from "./pages/Invoices";
import { Clients } from "./pages/Clients";
import { RequireAuth } from "./components/layouts/RequireAuth";
import { Settings } from "./pages/Settings";
import { Templates } from "./pages/Templates";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "pricing",
        element: <PricingPage />,
      },
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "sign-up",
        element: <SignUpForm />,
      },
      {
        path: "forgot-password",
        element: (
          <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
              <ForgotPasswordForm />
            </div>
          </div>
        ),
      },
      {
        path: "update-password",
        element: (
          <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
              <UpdatePasswordForm />
            </div>
          </div>
        ),
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <DashboardHome />,
              },
              {
                path: "invoices",
                element: <NewInvoice />,
              },
              {
                path: "all-invoices",
                element: <Invoices />,
              },
              {
                path: "clients",
                element: <Clients />,
              },
              {
                path: "templates",
                element: <Templates />,
              },
              {
                path: "settings",
                element: <Settings />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
