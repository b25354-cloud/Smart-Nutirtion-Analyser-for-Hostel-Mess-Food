import { Outlet } from "react-router-dom";

interface RoleRouteProps {
  allowedRoles: string[];
}

export const RoleRoute = ({ allowedRoles: _allowedRoles }: RoleRouteProps) => {
  return <Outlet />;
};