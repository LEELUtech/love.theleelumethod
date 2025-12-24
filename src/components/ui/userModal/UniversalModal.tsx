"use client";

import React, { ReactNode } from "react";
import { Modal } from "antd";

interface UniversalModalProps {
  open: boolean;
  onClose: () => void;
  width?: number;
  children: ReactNode;
  className?: string;
}

export default function UniversalModal({
  open,
  onClose,
  width = 640,
  children,
  className = "",
}: UniversalModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={width}
      className={`!p-0 !rounded-3xl !overflow-hidden custom-modal-tw ${className}`}
    >
      <div className="p-0 sm:p-2 md:p-4 lg:p-6 xl:p-8">
        {children}
      </div>
    </Modal>
  );
}
