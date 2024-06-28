/**
 * HOC Component:
 * Purpose: check permissions to render nested component
 * Input:
 *  - children: render component
 *  - requiredPermissions: permissions condition to render
 *  - userPermissions: permissions should validate
 * Output: React element
 */

'use client';

import { TFPermissions } from '@/constants/role-by-permissions';

interface IWithPermissions {
  children: React.ReactNode;
  requiredPermissions: TFPermissions[];
  validatePermissions: string[];
}

const WithPermissions: React.FC<IWithPermissions> = ({
  children,
  requiredPermissions,
  validatePermissions,
}) => {
  const hasPermission = requiredPermissions.every((permission) =>
    validatePermissions.includes(permission),
  );
  if (!hasPermission) {
    return null;
  } else return children;
};

export default WithPermissions;
