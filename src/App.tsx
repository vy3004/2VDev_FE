import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/main-layout";
import PageWrapper from "./components/common/page-wrapper";

import routes from "./routes/routes";

function App() {
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 5000,
          className: "dark:bg-gray-800 dark:text-gray-300",
        }}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {routes.map((route, index) =>
              route.path === "/" ? (
                <Route
                  index
                  key={index}
                  element={
                    route.path ? (
                      <PageWrapper state={route.path}>
                        {route.element}
                      </PageWrapper>
                    ) : (
                      route.element
                    )
                  }
                />
              ) : (
                <Route
                  path={route.path}
                  key={index}
                  element={
                    route.path ? (
                      <PageWrapper state={route.path}>
                        {route.element}
                      </PageWrapper>
                    ) : (
                      route.element
                    )
                  }
                />
              )
            )}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
