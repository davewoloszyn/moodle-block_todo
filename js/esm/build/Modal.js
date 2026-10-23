import{useEffect as n,useRef as i}from"react";import s from"@moodle/lms/core/String";import{jsx as o,jsxs as l}from"react/jsx-runtime";/**
 * A modal dialog, built on the native dialog element.
 *
 * @module     block_todo/Modal
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function c({title:a,onClose:e,children:d}){const t=i(null);return n(()=>{t.current?.showModal()},[]),o("dialog",{ref:t,className:"block_todo-modal",onClose:e,children:l("div",{className:"modal-content",children:[l("div",{className:"modal-header",children:[o("h5",{className:"modal-title",children:a}),o("button",{type:"button",className:"btn-close",onClick:e,children:o("span",{className:"visually-hidden",children:o(s,{identifier:"closebuttontitle",component:"core"})})})]}),d]})})}var u=c;export{u as default};
