import { TFPermissions } from '@/constants/role-by-permissions';
import { Button, ButtonProps } from '@mui/material';
import WithPermissions from '../auth/WithPermission';

interface ITFButton extends ButtonProps {
  requiredPermissions: TFPermissions[];
  userPermissions: string[];
}

export default function TFButton({
  requiredPermissions,
  userPermissions,
  ...otherProps
}: ITFButton) {
  return (
    <WithPermissions
      requiredPermissions={requiredPermissions}
      validatePermissions={userPermissions}
    >
      <Button {...otherProps}>{otherProps.children}</Button>
    </WithPermissions>
  );
}
