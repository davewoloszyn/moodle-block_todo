// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Calls to the block_todo web services.
 *
 * @module     block_todo/repository
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {fetchOne} from '@moodle/lms/core/ajax';

// Every block_todo web service returns the user's full, updated item list.
const call = (
    methodname: string,
    args: Record<string, unknown> = {}
) => fetchOne<any[]>({methodname, args});

export const addItem = (
    todotext: string,
    duedate: number,
    groupid: number
) =>
    call('block_todo_add_item', {todotext, duedate, groupid});

export const editItem = (
    id: number,
    todotext: string,
    duedate: number,
    groupid: number
) =>
    call('block_todo_edit_item', {id, todotext, duedate, groupid});

export const toggleItem = (
    id: number,
    hide: boolean
) =>
    call('block_todo_toggle_item', {id, hide});

export const pinItem = (
    id: number
) =>
    call('block_todo_pin_item', {id});

export const deleteItem = (
    id: number
) =>
    call('block_todo_delete_item', {id});

export const hideDoneItems = (
    hide: boolean
) =>
    call('block_todo_hide_done_items', {hide});

export const deleteCompleted = () =>
    call('block_todo_delete_completed');
