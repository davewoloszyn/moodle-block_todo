var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The actions menu (pin, edit, delete) shown on each item.
 *
 * @module     block_todo/ItemActions
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useState } from "react";
import { Dropdown, DropdownItemAction, DropdownItemDivider } from "@moodlehq/design-system";
import { getStrings } from "@moodle/lms/core/stringUtils";
function ItemActions({ item, onPin, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState({ actions: "", pin: "", unpin: "", edit: "", remove: "" });
  useEffect(() => {
    getStrings([
      { key: "actions", component: "core" },
      { key: "pin", component: "block_todo" },
      { key: "unpin", component: "block_todo" },
      { key: "edit", component: "core" },
      { key: "delete", component: "core" }
    ]).then(([actions, pin, unpin, edit, remove]) => {
      setLabels({ actions, pin, unpin, edit, remove });
      return;
    });
  }, []);
  const run = /* @__PURE__ */ __name((action) => {
    setOpen(false);
    action(item);
  }, "run");
  return /* @__PURE__ */ jsxDEV(
    Dropdown,
    {
      className: "ms-auto",
      label: labels.actions,
      iconOnly: true,
      appearance: "subtle",
      size: "md",
      placement: "bottom-end",
      startIcon: /* @__PURE__ */ jsxDEV("i", { className: "fa fa-ellipsis-vertical", "aria-hidden": "true" }, void 0, false, {
        fileName: "public/blocks/todo/js/esm/src/ItemActions.tsx",
        lineNumber: 68,
        columnNumber: 24
      }, this),
      open,
      onOpenChange: setOpen,
      children: [
        /* @__PURE__ */ jsxDEV(
          DropdownItemAction,
          {
            label: item.pin ? labels.unpin : labels.pin,
            startIcon: /* @__PURE__ */ jsxDEV("i", { className: "fa fa-thumbtack", "aria-hidden": "true" }, void 0, false, {
              fileName: "public/blocks/todo/js/esm/src/ItemActions.tsx",
              lineNumber: 74,
              columnNumber: 28
            }, this),
            onClick: () => run(onPin)
          },
          void 0,
          false,
          {
            fileName: "public/blocks/todo/js/esm/src/ItemActions.tsx",
            lineNumber: 72,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          DropdownItemAction,
          {
            label: labels.edit,
            startIcon: /* @__PURE__ */ jsxDEV("i", { className: "fa fa-pen", "aria-hidden": "true" }, void 0, false, {
              fileName: "public/blocks/todo/js/esm/src/ItemActions.tsx",
              lineNumber: 79,
              columnNumber: 28
            }, this),
            onClick: () => run(onEdit)
          },
          void 0,
          false,
          {
            fileName: "public/blocks/todo/js/esm/src/ItemActions.tsx",
            lineNumber: 77,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(DropdownItemDivider, {}, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/ItemActions.tsx",
          lineNumber: 82,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          DropdownItemAction,
          {
            label: labels.remove,
            variant: "danger",
            startIcon: /* @__PURE__ */ jsxDEV("i", { className: "fa fa-trash-can", "aria-hidden": "true" }, void 0, false, {
              fileName: "public/blocks/todo/js/esm/src/ItemActions.tsx",
              lineNumber: 86,
              columnNumber: 28
            }, this),
            onClick: () => run(onDelete)
          },
          void 0,
          false,
          {
            fileName: "public/blocks/todo/js/esm/src/ItemActions.tsx",
            lineNumber: 83,
            columnNumber: 13
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "public/blocks/todo/js/esm/src/ItemActions.tsx",
      lineNumber: 61,
      columnNumber: 9
    },
    this
  );
}
__name(ItemActions, "ItemActions");
var ItemActions_default = ItemActions;
export {
  ItemActions_default as default
};
//# sourceMappingURL=ItemActions.dev.js.map
