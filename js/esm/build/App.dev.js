var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * Root component of the ToDo block.
 *
 * Mounted automatically via data-react-component="@moodle/lms/block_todo/App" by core/react_autoinit.
 * Owns the item list state and handles all actions on it.
 *
 * @module     block_todo/App
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useState } from "react";
import { requireAsync } from "@moodle/lms/core/amd";
import String from "@moodle/lms/core/String";
import Header from "./Header";
import List from "./List";
import ConfirmModal from "./ConfirmModal";
import ItemModal from "./ItemModal";
import { addItem, editItem, toggleItem, pinItem, deleteItem, hideDoneItems, deleteCompleted } from "./repository";
const showError = /* @__PURE__ */ __name((exception) => {
  requireAsync("core/notification").then((notification) => notification.exception(exception));
}, "showError");
function App({ instanceid, items: initialitems }) {
  const [items, setItems] = useState(initialitems);
  const [selectedgroup, setSelectedgroup] = useState(0);
  const [dialog, setDialog] = useState(null);
  const [dialogitem, setDialogItem] = useState(null);
  const groupids = [...new Set(items.filter((item) => item.groupid > 0).map((item) => item.groupid))].sort((a, b) => a - b);
  const hascompleteditems = items.some((item) => item.done);
  const hidedone = items.some((item) => item.hide);
  const currentgroup = groupids.includes(selectedgroup) ? selectedgroup : 0;
  const visibleitems = items.filter((item) => !item.hide && (currentgroup === 0 || item.groupid === currentgroup));
  const update = /* @__PURE__ */ __name((request) => {
    request.then(setItems).catch(showError);
  }, "update");
  const openDialog = /* @__PURE__ */ __name((name, item = null) => {
    setDialogItem(item);
    setDialog(name);
  }, "openDialog");
  const closeDialog = /* @__PURE__ */ __name(() => {
    setDialog(null);
    setDialogItem(null);
  }, "closeDialog");
  return /* @__PURE__ */ jsxDEV("div", { "data-region": `block_todo-instance-${instanceid}`, children: [
    /* @__PURE__ */ jsxDEV(
      Header,
      {
        groupids,
        currentgroup,
        hascompleteditems,
        hidedone,
        onAdd: () => openDialog("add"),
        onGroup: setSelectedgroup,
        onToggleHideDone: () => update(hideDoneItems(!hidedone)),
        onDeleteCompleted: () => openDialog("deletecompleted")
      },
      void 0,
      false,
      {
        fileName: "public/blocks/todo/js/esm/src/App.tsx",
        lineNumber: 85,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      List,
      {
        items: visibleitems,
        onToggle: (item) => update(toggleItem(item.id, hidedone && !item.done)),
        onPin: (item) => update(pinItem(item.id)),
        onEdit: (item) => openDialog("edit", item),
        onDelete: (item) => openDialog("delete", item)
      },
      void 0,
      false,
      {
        fileName: "public/blocks/todo/js/esm/src/App.tsx",
        lineNumber: 95,
        columnNumber: 13
      },
      this
    ),
    dialog === "add" && /* @__PURE__ */ jsxDEV(
      ItemModal,
      {
        title: /* @__PURE__ */ jsxDEV(String, { identifier: "additem", component: "block_todo" }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/App.tsx",
          lineNumber: 106,
          columnNumber: 28
        }, this),
        onClose: closeDialog,
        onSubmit: (todotext, duedate, groupid) => {
          update(addItem(todotext, duedate, groupid));
          closeDialog();
        }
      },
      void 0,
      false,
      {
        fileName: "public/blocks/todo/js/esm/src/App.tsx",
        lineNumber: 105,
        columnNumber: 17
      },
      this
    ),
    dialog === "edit" && /* @__PURE__ */ jsxDEV(
      ItemModal,
      {
        title: /* @__PURE__ */ jsxDEV(String, { identifier: "edititem", component: "block_todo" }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/App.tsx",
          lineNumber: 116,
          columnNumber: 28
        }, this),
        item: dialogitem,
        onClose: closeDialog,
        onSubmit: (todotext, duedate, groupid) => {
          update(editItem(dialogitem.id, todotext, duedate, groupid));
          closeDialog();
        }
      },
      void 0,
      false,
      {
        fileName: "public/blocks/todo/js/esm/src/App.tsx",
        lineNumber: 115,
        columnNumber: 17
      },
      this
    ),
    dialog === "delete" && /* @__PURE__ */ jsxDEV(
      ConfirmModal,
      {
        title: /* @__PURE__ */ jsxDEV(String, { identifier: "deleteitem", component: "block_todo" }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/App.tsx",
          lineNumber: 127,
          columnNumber: 28
        }, this),
        onClose: closeDialog,
        onConfirm: () => {
          update(deleteItem(dialogitem.id));
          closeDialog();
        },
        children: /* @__PURE__ */ jsxDEV(String, { identifier: "confirmdeletesingle", component: "block_todo", params: dialogitem.todotext }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/App.tsx",
          lineNumber: 134,
          columnNumber: 21
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/blocks/todo/js/esm/src/App.tsx",
        lineNumber: 126,
        columnNumber: 17
      },
      this
    ),
    dialog === "deletecompleted" && /* @__PURE__ */ jsxDEV(
      ConfirmModal,
      {
        title: /* @__PURE__ */ jsxDEV(String, { identifier: "deletecompleted", component: "block_todo" }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/App.tsx",
          lineNumber: 139,
          columnNumber: 28
        }, this),
        onClose: closeDialog,
        onConfirm: () => {
          update(deleteCompleted());
          closeDialog();
        },
        children: /* @__PURE__ */ jsxDEV(String, { identifier: "confirmdeletecompleted", component: "block_todo" }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/App.tsx",
          lineNumber: 146,
          columnNumber: 21
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/blocks/todo/js/esm/src/App.tsx",
        lineNumber: 138,
        columnNumber: 17
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/blocks/todo/js/esm/src/App.tsx",
    lineNumber: 84,
    columnNumber: 9
  }, this);
}
__name(App, "App");
var App_default = App;
export {
  App_default as default
};
//# sourceMappingURL=App.dev.js.map
