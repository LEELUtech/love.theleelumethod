"use client";

import React, { useState } from "react";
import UniversalModal from "./UniversalModal";
import { CompatibilityForm, CompatibilityFormProps, CompatibilityFormValues } from "@/components/ui/forms/CompatibilityForm";

export interface CompatibilityModalProps<T extends React.ElementType = 'button'> extends Partial<CompatibilityFormProps> {
  trigger: ((open: () => void) => React.ReactNode) | React.ReactElement<unknown, T>;
  onSuccess?: (values: CompatibilityFormValues) => void;
  title?: string;
}

export default function CompatibilityModal<T extends React.ElementType = 'button'>({
  trigger,
  onSuccess,
  ...formProps
}: CompatibilityModalProps<T>) {
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
        <CompatibilityForm
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
