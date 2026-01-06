"use client";

import React, { useState } from "react";
import UniversalModal from "./UniversalModal";
import { UserForm, UserFormProps, UserFormValues } from "@/components/ui/forms/UserForm";

export interface UserDataModalProps<T extends React.ElementType = 'button'> extends Partial<UserFormProps> {
  trigger: ((open: () => void) => React.ReactNode) | React.ReactElement<unknown, T>;
  onSuccess?: (values: UserFormValues) => void;
  title?: string;
}

export default function UserDataModal<T extends React.ElementType = 'button'>({
  trigger,
  onSuccess,
  ...formProps
}: UserDataModalProps<T>) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {typeof trigger === 'function'
        ? trigger(handleOpen)
        : React.isValidElement(trigger)
          ? (() => {
              const el = trigger as React.ReactElement<Record<string, unknown>, T>;
              return React.cloneElement(el, {
                onClick: (e: React.MouseEvent) => {
                  if (typeof el.props.onClick === 'function') el.props.onClick(e);
                  handleOpen();
                }
              });
            })()
          : null}
      <UniversalModal open={open} onClose={handleClose}>
        <UserForm
          {...formProps}
          title={formProps.title}
          onSuccess={(values) => {
            handleClose();
            if (onSuccess) onSuccess(values);
          }}
        />
      </UniversalModal>
    </>
  );
}
