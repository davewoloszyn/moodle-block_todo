var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * The list of items: pinned items first, then the other items grouped by due date.
 *
 * @module     block_todo/List
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import ListItem from "./ListItem";
import PinnedItem from "./PinnedItem";
import DueDate from "./DueDate";
function List({ items, ...handlers }) {
  const pinned = items.filter((item) => item.pin);
  const groups = /* @__PURE__ */ new Map();
  for (const item of items.filter((item2) => !item2.pin)) {
    const key = item.duedate ?? 0;
    groups.set(key, [...groups.get(key) ?? [], item]);
  }
  const duedates = [...groups.keys()].sort((a, b) => {
    if (a === 0) {
      return 1;
    }
    if (b === 0) {
      return -1;
    }
    return a - b;
  });
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    pinned.length > 0 && /* @__PURE__ */ jsxDEV("ul", { className: "list-group unstyled todogroup mb-3", children: pinned.map((item) => /* @__PURE__ */ jsxDEV(PinnedItem, { item, ...handlers }, item.id, false, {
      fileName: "public/blocks/todo/js/esm/src/List.tsx",
      lineNumber: 62,
      columnNumber: 25
    }, this)) }, void 0, false, {
      fileName: "public/blocks/todo/js/esm/src/List.tsx",
      lineNumber: 60,
      columnNumber: 17
    }, this),
    duedates.map((duedate) => /* @__PURE__ */ jsxDEV("div", { children: [
      duedate > 0 && /* @__PURE__ */ jsxDEV("div", { className: "h6", children: /* @__PURE__ */ jsxDEV(DueDate, { duedate }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/List.tsx",
        lineNumber: 70,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/List.tsx",
        lineNumber: 69,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("ul", { className: "list-group unstyled todogroup mb-3", children: groups.get(duedate).map((item) => /* @__PURE__ */ jsxDEV(ListItem, { item, ...handlers }, item.id, false, {
        fileName: "public/blocks/todo/js/esm/src/List.tsx",
        lineNumber: 75,
        columnNumber: 29
      }, this)) }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/List.tsx",
        lineNumber: 73,
        columnNumber: 21
      }, this)
    ] }, duedate, true, {
      fileName: "public/blocks/todo/js/esm/src/List.tsx",
      lineNumber: 67,
      columnNumber: 17
    }, this))
  ] }, void 0, true, {
    fileName: "public/blocks/todo/js/esm/src/List.tsx",
    lineNumber: 58,
    columnNumber: 9
  }, this);
}
__name(List, "List");
var List_default = List;
export {
  List_default as default
};
//# sourceMappingURL=List.dev.js.map
