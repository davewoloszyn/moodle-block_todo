var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * The block header: the add button, group filters and completed item controls.
 *
 * @module     block_todo/Header
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useState } from "react";
import { Button, Tooltip } from "@moodlehq/design-system";
import { getStrings } from "@moodle/lms/core/stringUtils";
import { GROUP_IDS, GROUP_ICONS } from "./groups";
function Header({
  groupids,
  currentgroup,
  hascompleteditems,
  hidedone,
  onAdd,
  onGroup,
  onToggleHideDone,
  onDeleteCompleted
}) {
  const [addLabel, setAddLabel] = useState("");
  const [showCompletedLabel, setShowCompletedLabel] = useState("");
  const [hideCompletedLabel, setHideCompletedLabel] = useState("");
  const [deleteCompletedLabel, setDeleteCompletedLabel] = useState("");
  useEffect(() => {
    getStrings([
      { key: "additem", component: "block_todo" },
      { key: "showcompleted", component: "block_todo" },
      { key: "hidecompleted", component: "block_todo" },
      { key: "deletecompleted", component: "block_todo" }
    ]).then(([additem, showcompleted, hidecompleted, deletecompleted]) => {
      setAddLabel(additem);
      setShowCompletedLabel(showcompleted);
      setHideCompletedLabel(hidecompleted);
      setDeleteCompletedLabel(deletecompleted);
      return;
    });
  }, []);
  const [groupLabels, setGroupLabels] = useState([]);
  useEffect(() => {
    getStrings(GROUP_IDS.map((groupid) => ({ key: `showgroup${groupid}`, component: "block_todo" }))).then(setGroupLabels);
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "mb-3 button-header", children: [
    /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(
      Button,
      {
        className: "add-button",
        label: addLabel,
        startIcon: /* @__PURE__ */ jsxDEV("i", { "aria-hidden": "true", className: "fa-solid fa-plus" }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/Header.tsx",
          lineNumber: 86,
          columnNumber: 32
        }, this),
        onClick: onAdd
      },
      void 0,
      false,
      {
        fileName: "public/blocks/todo/js/esm/src/Header.tsx",
        lineNumber: 83,
        columnNumber: 17
      },
      this
    ) }, void 0, false, {
      fileName: "public/blocks/todo/js/esm/src/Header.tsx",
      lineNumber: 82,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "action-buttons", children: [
      groupids.map((groupid) => /* @__PURE__ */ jsxDEV(Tooltip, { label: groupLabels[GROUP_IDS.indexOf(groupid)] ?? "", children: /* @__PURE__ */ jsxDEV(
        Button,
        {
          variant: "ghost",
          className: groupid === currentgroup ? "active" : void 0,
          "aria-pressed": groupid === currentgroup,
          onClick: () => onGroup(groupid === currentgroup ? 0 : groupid),
          startIcon: /* @__PURE__ */ jsxDEV(
            "i",
            {
              className: `${GROUP_ICONS[groupid]} group-icon group-icon-${groupid}`,
              "aria-hidden": "true"
            },
            void 0,
            false,
            {
              fileName: "public/blocks/todo/js/esm/src/Header.tsx",
              lineNumber: 101,
              columnNumber: 33
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "public/blocks/todo/js/esm/src/Header.tsx",
          lineNumber: 94,
          columnNumber: 25
        },
        this
      ) }, groupid, false, {
        fileName: "public/blocks/todo/js/esm/src/Header.tsx",
        lineNumber: 93,
        columnNumber: 21
      }, this)),
      hascompleteditems && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(Tooltip, { label: hidedone ? showCompletedLabel : hideCompletedLabel, children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            variant: "ghost",
            onClick: onToggleHideDone,
            startIcon: /* @__PURE__ */ jsxDEV("i", { className: `fa ${hidedone ? "fa-eye" : "fa-eye-slash"}`, "aria-hidden": "true" }, void 0, false, {
              fileName: "public/blocks/todo/js/esm/src/Header.tsx",
              lineNumber: 115,
              columnNumber: 44
            }, this)
          },
          void 0,
          false,
          {
            fileName: "public/blocks/todo/js/esm/src/Header.tsx",
            lineNumber: 112,
            columnNumber: 29
          },
          this
        ) }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/Header.tsx",
          lineNumber: 111,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV(Tooltip, { label: deleteCompletedLabel, children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            variant: "ghost",
            onClick: onDeleteCompleted,
            startIcon: /* @__PURE__ */ jsxDEV("i", { className: "fa fa-trash", "aria-hidden": "true" }, void 0, false, {
              fileName: "public/blocks/todo/js/esm/src/Header.tsx",
              lineNumber: 122,
              columnNumber: 44
            }, this)
          },
          void 0,
          false,
          {
            fileName: "public/blocks/todo/js/esm/src/Header.tsx",
            lineNumber: 119,
            columnNumber: 29
          },
          this
        ) }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/Header.tsx",
          lineNumber: 118,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "public/blocks/todo/js/esm/src/Header.tsx",
        lineNumber: 110,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "public/blocks/todo/js/esm/src/Header.tsx",
      lineNumber: 90,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/blocks/todo/js/esm/src/Header.tsx",
    lineNumber: 81,
    columnNumber: 9
  }, this);
}
__name(Header, "Header");
var Header_default = Header;
export {
  Header_default as default
};
//# sourceMappingURL=Header.dev.js.map
