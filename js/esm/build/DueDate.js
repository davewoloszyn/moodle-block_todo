import{useEffect as b,useState as o}from"react";import{Badge as a}from"@moodlehq/design-system";import{getStrings as g}from"@moodle/lms/core/stringUtils";import{Fragment as v,jsx as n,jsxs as r}from"react/jsx-runtime";/**
 * A due date, with "Today" and "Overdue" badges where relevant.
 *
 * @module     block_todo/DueDate
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function y({duedate:e}){const t=new Date(e*1e3),s=document.documentElement.lang||void 0,l=t.toLocaleDateString(s,{weekday:"short",day:"numeric",month:"short"}),c=t.toDateString()===new Date().toDateString(),d=e<=Date.now()/1e3-86400,[u,m]=o(""),[i,f]=o("");return b(()=>{g([{key:"today",component:"block_todo"},{key:"overdue",component:"block_todo"}]).then(([p,D])=>{m(p),f(D)})},[]),r(v,{children:[l,r("span",{className:"ms-1",children:[c&&n(a,{label:u,pill:!0,subtle:!1,variant:"success"}),d&&n(a,{label:i,pill:!0,subtle:!1,variant:"danger"})]})]})}var h=y;export{h as default};
