import u from"./ListItem";import d from"./PinnedItem";import a from"./DueDate";import{Fragment as y,jsx as o,jsxs as m}from"react/jsx-runtime";/**
 * The list of items: pinned items first, then the other items grouped by due date.
 *
 * @module     block_todo/List
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function l({items:n,...r}){const s=n.filter(t=>t.pin),i=new Map;for(const t of n.filter(e=>!e.pin)){const e=t.duedate??0;i.set(e,[...i.get(e)??[],t])}const p=[...i.keys()].sort((t,e)=>t===0?1:e===0?-1:t-e);return m(y,{children:[s.length>0&&o("ul",{className:"list-group unstyled todogroup mb-3",children:s.map(t=>o(d,{item:t,...r},t.id))}),p.map(t=>m("div",{children:[t>0&&o("div",{className:"h6",children:o(a,{duedate:t})}),o("ul",{className:"list-group unstyled todogroup mb-3",children:i.get(t).map(e=>o(u,{item:e,...r},e.id))})]},t))]})}var v=l;export{v as default};
