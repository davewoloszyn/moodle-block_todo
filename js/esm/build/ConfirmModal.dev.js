var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * A modal asking the user to confirm an action.
 *
 * @module     block_todo/ConfirmModal
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useState } from "react";
import { Button } from "@moodlehq/design-system";
import { getStrings } from "@moodle/lms/core/stringUtils";
import Modal from "./Modal";
function ConfirmModal({ title, onConfirm, onClose, children }) {
  const [cancelLabel, setCancelLabel] = useState("");
  const [confirmLabel, setConfirmLabel] = useState("");
  useEffect(() => {
    getStrings([
      { key: "cancel", component: "core" },
      { key: "confirm", component: "core" }
    ]).then(([cancel, confirm]) => {
      setCancelLabel(cancel);
      setConfirmLabel(confirm);
      return;
    });
  }, []);
  return /* @__PURE__ */ jsxDEV(Modal, { title, onClose, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "modal-body my-4", children }, void 0, false, {
      fileName: "public/blocks/todo/js/esm/src/ConfirmModal.tsx",
      lineNumber: 54,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "modal-footer gap-2", children: [
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          label: cancelLabel,
          onClick: onClose,
          variant: "secondary",
          size: "lg"
        },
        void 0,
        false,
        {
          fileName: "public/blocks/todo/js/esm/src/ConfirmModal.tsx",
          lineNumber: 56,
          columnNumber: 17
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          label: confirmLabel,
          onClick: onConfirm,
          variant: "danger",
          size: "lg"
        },
        void 0,
        false,
        {
          fileName: "public/blocks/todo/js/esm/src/ConfirmModal.tsx",
          lineNumber: 62,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/blocks/todo/js/esm/src/ConfirmModal.tsx",
      lineNumber: 55,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/blocks/todo/js/esm/src/ConfirmModal.tsx",
    lineNumber: 53,
    columnNumber: 9
  }, this);
}
__name(ConfirmModal, "ConfirmModal");
var ConfirmModal_default = ConfirmModal;
export {
  ConfirmModal_default as default
};
//# sourceMappingURL=ConfirmModal.dev.js.map
