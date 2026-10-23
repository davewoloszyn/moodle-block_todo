import{fetchOne as d}from"@moodle/lms/core/ajax";/**
 * Calls to the block_todo web services.
 *
 * @module     block_todo/repository
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const t=(e,o={})=>d({methodname:e,args:o}),_=(e,o,n)=>t("block_todo_add_item",{todotext:e,duedate:o,groupid:n}),c=(e,o,n,m)=>t("block_todo_edit_item",{id:e,todotext:o,duedate:n,groupid:m}),l=(e,o)=>t("block_todo_toggle_item",{id:e,hide:o}),b=e=>t("block_todo_pin_item",{id:e}),i=e=>t("block_todo_delete_item",{id:e}),s=e=>t("block_todo_hide_done_items",{hide:e}),p=()=>t("block_todo_delete_completed");export{_ as addItem,p as deleteCompleted,i as deleteItem,c as editItem,s as hideDoneItems,b as pinItem,l as toggleItem};
