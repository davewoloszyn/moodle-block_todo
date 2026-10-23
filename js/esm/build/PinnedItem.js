import l from"@moodle/lms/core/String";import s from"./DueDate";import u from"./ItemActions";import{GROUP_ICONS as m}from"./groups";import{jsx as o,jsxs as n}from"react/jsx-runtime";/**
 * A single pinned item in the list.
 *
 * @module     block_todo/PinnedItem
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function p({item:e,onToggle:d,onPin:i,onEdit:t,onDelete:a}){const r=e.done?"fa-solid fa-square-check":"fa-regular fa-square";return n("li",{className:`list-group-item todo-item pinned-item ${e.done?"text-muted":""}`,children:[n("button",{type:"button",className:"btn btn-link toggle-done",onClick:()=>d(e),children:[o("i",{className:r,"aria-hidden":"true"}),o("span",{className:"visually-hidden",children:o(l,{identifier:"toggle",component:"block_todo"})})]}),o("div",{className:"me-auto",children:n("div",{className:"d-inline-block",children:[e.duedate&&o("div",{className:"pinned-duedate",children:o(s,{duedate:e.duedate})}),n("span",{className:e.done?"done":"",children:[e.groupid>0&&o("i",{className:`me-1 ${m[e.groupid]} group-icon group-icon-${e.groupid}`,"aria-hidden":"true"}),e.todotext]})]})}),o(u,{item:e,onPin:i,onEdit:t,onDelete:a})]})}var v=p;export{v as default};
