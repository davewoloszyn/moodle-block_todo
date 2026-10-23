var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The modal with the add/edit item form.
 *
 * @module     block_todo/ItemModal
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useId, useEffect, useState } from "react";
import { Button, Tooltip } from "@moodlehq/design-system";
import String from "@moodle/lms/core/String";
import { getStrings } from "@moodle/lms/core/stringUtils";
import Modal from "./Modal";
import { GROUP_IDS, GROUP_ICONS } from "./groups";
const toTimestamp = /* @__PURE__ */ __name((value) => {
  if (!value) {
    return 0;
  }
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).getTime() / 1e3;
}, "toTimestamp");
const toDateValue = /* @__PURE__ */ __name((timestamp) => {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp * 1e3);
  const pad = /* @__PURE__ */ __name((n) => `${n}`.padStart(2, "0"), "pad");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}, "toDateValue");
function ItemModal({ title, item, onSubmit, onClose }) {
  const id = useId();
  const [selectedgroup, setSelectedgroup] = useState(item?.groupid ?? 0);
  const [cancelLabel, setCancelLabel] = useState("");
  const [saveChangesLabel, setSaveChangesLabel] = useState("");
  const [addLabel, setAddLabel] = useState("");
  const [groupLabels, setGroupLabels] = useState([]);
  useEffect(() => {
    getStrings([
      { key: "cancel", component: "core" },
      { key: "savechanges", component: "core" },
      { key: "add", component: "core" },
      ...GROUP_IDS.map((groupid) => ({ key: `labelgroup${groupid}`, component: "block_todo" }))
    ]).then(([cancel, savechanges, add, ...groups]) => {
      setCancelLabel(cancel);
      setSaveChangesLabel(savechanges);
      setAddLabel(add);
      setGroupLabels(groups);
      return;
    });
  }, []);
  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const todotext = `${data.get("todotext") ?? ""}`.trim();
    if (!todotext) {
      return;
    }
    onSubmit(todotext, toTimestamp(`${data.get("duedate") ?? ""}`), Number(data.get("groupid") ?? 0));
  }
  __name(handleSubmit, "handleSubmit");
  return /* @__PURE__ */ jsxDEV(Modal, { title, onClose, children: /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "modal-body my-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: `${id}-text`, children: /* @__PURE__ */ jsxDEV(String, { identifier: "itemname", component: "block_todo" }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
          lineNumber: 101,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
          lineNumber: 100,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: `${id}-text`,
            type: "text",
            name: "todotext",
            className: "form-control",
            maxLength: 125,
            defaultValue: item?.todotext ?? "",
            required: true,
            autoFocus: true
          },
          void 0,
          false,
          {
            fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
            lineNumber: 103,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
        lineNumber: 99,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: `${id}-duedate`, children: /* @__PURE__ */ jsxDEV(String, { identifier: "duedate", component: "block_todo" }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
          lineNumber: 116,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
          lineNumber: 115,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: `${id}-duedate`,
            type: "date",
            name: "duedate",
            className: "form-control",
            defaultValue: toDateValue(item?.duedate ?? null)
          },
          void 0,
          false,
          {
            fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
            lineNumber: 118,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
        lineNumber: 114,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxDEV("div", { id: `${id}-group-label`, children: /* @__PURE__ */ jsxDEV(String, { identifier: "group", component: "block_todo" }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
          lineNumber: 128,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
          lineNumber: 127,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            role: "group",
            "aria-labelledby": `${id}-group-label`,
            className: "action-buttons",
            children: GROUP_IDS.map((groupid) => /* @__PURE__ */ jsxDEV(Tooltip, { label: groupLabels[GROUP_IDS.indexOf(groupid)] ?? "", children: /* @__PURE__ */ jsxDEV(
              Button,
              {
                variant: "ghost",
                className: groupid === selectedgroup ? "active" : void 0,
                "aria-pressed": groupid === selectedgroup,
                onClick: () => setSelectedgroup(groupid),
                startIcon: /* @__PURE__ */ jsxDEV(
                  "i",
                  {
                    className: groupid > 0 ? `${GROUP_ICONS[groupid]} group-icon group-icon-${groupid}` : "fa-solid fa-ban",
                    "aria-hidden": "true"
                  },
                  void 0,
                  false,
                  {
                    fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
                    lineNumber: 144,
                    columnNumber: 45
                  },
                  this
                )
              },
              void 0,
              false,
              {
                fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
                lineNumber: 138,
                columnNumber: 37
              },
              this
            ) }, groupid, false, {
              fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
              lineNumber: 137,
              columnNumber: 33
            }, this))
          },
          void 0,
          false,
          {
            fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
            lineNumber: 130,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: "groupid", value: selectedgroup }, void 0, false, {
          fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
          lineNumber: 156,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
        lineNumber: 126,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
      lineNumber: 98,
      columnNumber: 17
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
          fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
          lineNumber: 160,
          columnNumber: 21
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          label: item ? saveChangesLabel : addLabel,
          variant: "primary",
          type: "submit",
          size: "lg"
        },
        void 0,
        false,
        {
          fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
          lineNumber: 166,
          columnNumber: 21
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
      lineNumber: 159,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
    lineNumber: 97,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/blocks/todo/js/esm/src/ItemModal.tsx",
    lineNumber: 96,
    columnNumber: 9
  }, this);
}
__name(ItemModal, "ItemModal");
var ItemModal_default = ItemModal;
export {
  ItemModal_default as default
};
//# sourceMappingURL=ItemModal.dev.js.map
