import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

function Modal({
  open,
  children,
  onClose,
}: {
  open: boolean;
  children: JSX.Element;
  onClose: () => void;
}): JSX.Element {
  const portalRoot =
    typeof document !== `undefined`
      ? document.querySelector("#portal")
      : undefined;

  const backdrop = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const modal = {
    hidden: {
      y: 100,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
    },
  };

  if (!portalRoot) {
    return <></>;
  }

  return createPortal(
    <>
      {open && (
        <motion.div
          variants={backdrop}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="fixed -top-4 left-0 right-0 bottom-0 z-40 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
          onClick={onClose}
          onKeyDown={onClose}
          role="button"
          tabIndex={0}
        >
          <motion.div
            variants={modal}
            className="relative z-50 w-full max-w-2xl overflow-y-auto p-8 text-white"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            role="button"
            tabIndex={-1}
          >
            {children}
            <button
              onClick={onClose}
              onKeyDown={onClose}
              className="absolute top-0 right-0 m-2 text-2xl"
              tabIndex={-1}
              type="button"
            >
              <FiX />
            </button>
          </motion.div>
        </motion.div>
      )}
    </>,
    portalRoot
  );
}

export default Modal;
