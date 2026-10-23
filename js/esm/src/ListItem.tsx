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
 * A single (unpinned) item in the list.
 *
 * @module     block_todo/ListItem
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import String from "@moodle/lms/core/String";
import ItemActions from "./ItemActions";
import {GROUP_ICONS} from "./groups";

interface ListItemProps {
    item: {
        id: number;
        todotext: string;
        done: boolean;
        pin: boolean;
        hide: boolean;
        duedate: number | null;
        groupid: number;
    };
    onToggle: (item: any) => void;
    onPin: (item: any) => void;
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
}

function ListItem({item, onToggle, onPin, onEdit, onDelete}: ListItemProps) {
    const doneIcon = item.done ? 'fa-solid fa-square-check' : 'fa-regular fa-square';

    return (
        <li className={`list-group-item todo-item ${item.done ? 'text-muted' : ''}`}>
            <button type="button" className="btn btn-link toggle-done" onClick={() => onToggle(item)}>
                <i className={doneIcon} aria-hidden="true"></i>
                <span className="visually-hidden">
                    <String identifier="toggle" component="block_todo" />
                </span>
            </button>
            <div className="me-auto">
                {item.groupid > 0 && (
                    <i
                        className={`me-1 ${GROUP_ICONS[item.groupid]} group-icon group-icon-${item.groupid}`}
                        aria-hidden="true"
                    />
                )}
                <span className={item.done ? 'done' : ''}>{item.todotext}</span>
            </div>
            <ItemActions item={item} onPin={onPin} onEdit={onEdit} onDelete={onDelete} />
        </li>
    );
}

export default ListItem;
