import{useEffect as C,useState as t}from"react";import{Button as a}from"@moodlehq/design-system";import{getStrings as v}from"@moodle/lms/core/stringUtils";import b from"./Modal";import{jsx as o,jsxs as n}from"react/jsx-runtime";/**
 * A modal asking the user to confirm an action.
 *
 * @module     block_todo/ConfirmModal
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function g({title:r,onConfirm:l,onClose:e,children:i}){const[c,d]=t(""),[m,f]=t("");return C(()=>{v([{key:"cancel",component:"core"},{key:"confirm",component:"core"}]).then(([s,p])=>{d(s),f(p)})},[]),n(b,{title:r,onClose:e,children:[o("div",{className:"modal-body my-4",children:i}),n("div",{className:"modal-footer gap-2",children:[o(a,{label:c,onClick:e,variant:"secondary",size:"lg"}),o(a,{label:m,onClick:l,variant:"danger",size:"lg"})]})]})}var k=g;export{k as default};
