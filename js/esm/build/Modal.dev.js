var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * A modal dialog, built on the native dialog element.
 *
 * @module     block_todo/Modal
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useRef } from "react";
import String from "@moodle/lms/core/String";
function Modal({ title, onClose, children }) {
  const dialog = useRef(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return /* @__PURE__ */ jsxDEV("dialog", { ref: dialog, className: "block_todo-modal", onClose, children: /* @__PURE__ */ jsxDEV("div", { className: "modal-content", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "modal-header", children: [
      /* @__PURE__ */ jsxDEV("h5", { className: "modal-title", children: title }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/Modal.tsx",
        lineNumber: 47,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn-close", onClick: onClose, children: /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: /* @__PURE__ */ jsxDEV(String, { identifier: "closebuttontitle", component: "core" }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/Modal.tsx",
        lineNumber: 50,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/Modal.tsx",
        lineNumber: 49,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/Modal.tsx",
        lineNumber: 48,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "public/blocks/todo/js/esm/src/Modal.tsx",
      lineNumber: 46,
      columnNumber: 17
    }, this),
    children
  ] }, void 0, true, {
    fileName: "public/blocks/todo/js/esm/src/Modal.tsx",
    lineNumber: 45,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/blocks/todo/js/esm/src/Modal.tsx",
    lineNumber: 44,
    columnNumber: 9
  }, this);
}
__name(Modal, "Modal");
var Modal_default = Modal;
export {
  Modal_default as default
};
//# sourceMappingURL=Modal.dev.js.map
