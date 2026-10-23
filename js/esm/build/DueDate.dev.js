var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * A due date, with "Today" and "Overdue" badges where relevant.
 *
 * @module     block_todo/DueDate
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useState } from "react";
import { Badge } from "@moodlehq/design-system";
import { getStrings } from "@moodle/lms/core/stringUtils";
function DueDate({ duedate }) {
  const due = new Date(duedate * 1e3);
  const locale = document.documentElement.lang || void 0;
  const formatted = due.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  const today = due.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
  const overdue = duedate <= Date.now() / 1e3 - 86400;
  const [todayLabel, setTodayLabel] = useState("");
  const [overdueLabel, setOverdueLabel] = useState("");
  useEffect(() => {
    getStrings([
      { key: "today", component: "block_todo" },
      { key: "overdue", component: "block_todo" }
    ]).then(([todaystring, overduestring]) => {
      setTodayLabel(todaystring);
      setOverdueLabel(overduestring);
      return;
    });
  }, []);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    formatted,
    /* @__PURE__ */ jsxDEV("span", { className: "ms-1", children: [
      today && /* @__PURE__ */ jsxDEV(
        Badge,
        {
          label: todayLabel,
          pill: true,
          subtle: false,
          variant: "success"
        },
        void 0,
        false,
        {
          fileName: "public/blocks/todo/js/esm/src/DueDate.tsx",
          lineNumber: 60,
          columnNumber: 21
        },
        this
      ),
      overdue && /* @__PURE__ */ jsxDEV(
        Badge,
        {
          label: overdueLabel,
          pill: true,
          subtle: false,
          variant: "danger"
        },
        void 0,
        false,
        {
          fileName: "public/blocks/todo/js/esm/src/DueDate.tsx",
          lineNumber: 68,
          columnNumber: 21
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/blocks/todo/js/esm/src/DueDate.tsx",
      lineNumber: 58,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/blocks/todo/js/esm/src/DueDate.tsx",
    lineNumber: 56,
    columnNumber: 9
  }, this);
}
__name(DueDate, "DueDate");
var DueDate_default = DueDate;
export {
  DueDate_default as default
};
//# sourceMappingURL=DueDate.dev.js.map
