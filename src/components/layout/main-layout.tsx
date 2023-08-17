import Footer from "../footer";
import Header from "../header";
import Sidebar from "../sidebar";

import Container from "../ui/container";

import AuthModal from "../modals/auth-modal";

const MainLayout = () => {
  return (
    <>
      <AuthModal />

      <Header />

      {/* Page Content */}
      <Container>
        <div className="grid grid-cols-10">
          <div className="hidden h-full col-span-2 xl:flex xl:flex-col">
            <Sidebar />
          </div>
          <div className="col-span-10 md:col-span-7 xl:col-span-6 bg-yellow-500 h-screen">
            content
          </div>
          <div className="md:col-span-3 xl:col-span-2 bg-blue-500"></div>
        </div>
      </Container>
      {/* Page Content */}

      <Footer />
    </>
  );
};

export default MainLayout;
