import s from"@moodle/lms/core/String";import l from"./ItemActions";import{GROUP_ICONS as u}from"./groups";import{jsx as e,jsxs as n}from"react/jsx-runtime";/**
 * A single (unpinned) item in the list.
 *
 * @module     block_todo/ListItem
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function m({item:o,onToggle:t,onPin:i,onEdit:a,onDelete:d}){const r=o.done?"fa-solid fa-square-check":"fa-regular fa-square";return n("li",{className:`list-group-item todo-item ${o.done?"text-muted":""}`,children:[n("button",{type:"button",className:"btn btn-link toggle-done",onClick:()=>t(o),children:[e("i",{className:r,"aria-hidden":"true"}),e("span",{className:"visually-hidden",children:e(s,{identifier:"toggle",component:"block_todo"})})]}),n("div",{className:"me-auto",children:[o.groupid>0&&e("i",{className:`me-1 ${u[o.groupid]} group-icon group-icon-${o.groupid}`,"aria-hidden":"true"}),e("span",{className:o.done?"done":"",children:o.todotext})]}),e(l,{item:o,onPin:i,onEdit:a,onDelete:d})]})}var b=m;export{b as default};
