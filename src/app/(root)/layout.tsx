import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* <Navbar /> */}
      {children}
      <footer></footer>
    </div>
  );
};

export default Layout;
