var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * Calls to the block_todo web services.
 *
 * @module     block_todo/repository
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { fetchOne } from "@moodle/lms/core/ajax";
const call = /* @__PURE__ */ __name((methodname, args = {}) => fetchOne({ methodname, args }), "call");
const addItem = /* @__PURE__ */ __name((todotext, duedate, groupid) => call("block_todo_add_item", { todotext, duedate, groupid }), "addItem");
const editItem = /* @__PURE__ */ __name((id, todotext, duedate, groupid) => call("block_todo_edit_item", { id, todotext, duedate, groupid }), "editItem");
const toggleItem = /* @__PURE__ */ __name((id, hide) => call("block_todo_toggle_item", { id, hide }), "toggleItem");
const pinItem = /* @__PURE__ */ __name((id) => call("block_todo_pin_item", { id }), "pinItem");
const deleteItem = /* @__PURE__ */ __name((id) => call("block_todo_delete_item", { id }), "deleteItem");
const hideDoneItems = /* @__PURE__ */ __name((hide) => call("block_todo_hide_done_items", { hide }), "hideDoneItems");
const deleteCompleted = /* @__PURE__ */ __name(() => call("block_todo_delete_completed"), "deleteCompleted");
export {
  addItem,
  deleteCompleted,
  deleteItem,
  editItem,
  hideDoneItems,
  pinItem,
  toggleItem
};
//# sourceMappingURL=repository.dev.js.map
