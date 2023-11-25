 import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      {/* Here can be shared content */}
      <Outlet />
      {/* Here can be shared content */}
    </div>
  );
}

export { Layout }