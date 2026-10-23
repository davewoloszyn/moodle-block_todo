var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * A single (unpinned) item in the list.
 *
 * @module     block_todo/ListItem
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import String from "@moodle/lms/core/String";
import ItemActions from "./ItemActions";
import { GROUP_ICONS } from "./groups";
function ListItem({ item, onToggle, onPin, onEdit, onDelete }) {
  const doneIcon = item.done ? "fa-solid fa-square-check" : "fa-regular fa-square";
  return /* @__PURE__ */ jsxDEV("li", { className: `list-group-item todo-item ${item.done ? "text-muted" : ""}`, children: [
    /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-link toggle-done", onClick: () => onToggle(item), children: [
      /* @__PURE__ */ jsxDEV("i", { className: doneIcon, "aria-hidden": "true" }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/ListItem.tsx",
        lineNumber: 50,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: /* @__PURE__ */ jsxDEV(String, { identifier: "toggle", component: "block_todo" }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/ListItem.tsx",
        lineNumber: 52,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/ListItem.tsx",
        lineNumber: 51,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/blocks/todo/js/esm/src/ListItem.tsx",
      lineNumber: 49,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "me-auto", children: [
      item.groupid > 0 && /* @__PURE__ */ jsxDEV(
        "i",
        {
          className: `me-1 ${GROUP_ICONS[item.groupid]} group-icon group-icon-${item.groupid}`,
          "aria-hidden": "true"
        },
        void 0,
        false,
        {
          fileName: "public/blocks/todo/js/esm/src/ListItem.tsx",
          lineNumber: 57,
          columnNumber: 21
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("span", { className: item.done ? "done" : "", children: item.todotext }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/ListItem.tsx",
        lineNumber: 62,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/blocks/todo/js/esm/src/ListItem.tsx",
      lineNumber: 55,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(ItemActions, { item, onPin, onEdit, onDelete }, void 0, false, {
      fileName: "public/blocks/todo/js/esm/src/ListItem.tsx",
      lineNumber: 64,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/blocks/todo/js/esm/src/ListItem.tsx",
    lineNumber: 48,
    columnNumber: 9
  }, this);
}
__name(ListItem, "ListItem");
var ListItem_default = ListItem;
export {
  ListItem_default as default
};
//# sourceMappingURL=ListItem.dev.js.map
