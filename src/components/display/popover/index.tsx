import { Popover, PopoverProps } from 'antd';
import { ReactNode } from 'react';

interface IAppPopover extends PopoverProps {
  triggerComponent: ReactNode;
}
function AppPopover({ triggerComponent, ...props }: IAppPopover) {
  return <Popover {...props}>{triggerComponent}</Popover>;
}

export default AppPopover;
