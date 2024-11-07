import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Add your header/navbar here */}
      <main>
        <Outlet />
      </main>
      {/* Add your footer here */}
    </div>
  );
};

export default RootLayout;
