import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { checkPermission } from "../utils/permissions";
import { Navigate } from "react-router-dom";

const PermissionGuard = ({ children, permission }) => {
  const { user } = useSelector((state) => state.auth);

  if (!checkPermission(user, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

PermissionGuard.propTypes = {
  children: PropTypes.node.isRequired,
  permission: PropTypes.string.isRequired,
};

export default PermissionGuard;
