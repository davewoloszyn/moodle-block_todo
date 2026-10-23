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
 * The list of items: pinned items first, then the other items grouped by due date.
 *
 * @module     block_todo/List
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ListItem from "./ListItem";
import PinnedItem from "./PinnedItem";
import DueDate from "./DueDate";

interface ListProps {
    items: any[];
    onToggle: (item: any) => void;
    onPin: (item: any) => void;
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
}

function List({items, ...handlers}: ListProps) {
    const pinned = items.filter((item) => item.pin);

    // Group the unpinned items by due date. Items without a due date share the 0 key.
    const groups = new Map<number, any[]>();
    for (const item of items.filter((item) => !item.pin)) {
        const key = item.duedate ?? 0;
        groups.set(key, [...(groups.get(key) ?? []), item]);
    }

    // Sort the groups by due date ASC, with the undated group last.
    const duedates = [...groups.keys()].sort((a, b) => {
        if (a === 0) {
            return 1;
        }
        if (b === 0) {
            return -1;
        }
        return a - b;
    });

    return (
        <>
            {pinned.length > 0 && (
                <ul className="list-group unstyled todogroup mb-3">
                    {pinned.map((item) => (
                        <PinnedItem key={item.id} item={item} {...handlers} />
                    ))}
                </ul>
            )}
            {duedates.map((duedate) => (
                <div key={duedate}>
                    {duedate > 0 && (
                        <div className="h6">
                            <DueDate duedate={duedate} />
                        </div>
                    )}
                    <ul className="list-group unstyled todogroup mb-3">
                        {groups.get(duedate)!.map((item) => (
                            <ListItem key={item.id} item={item} {...handlers} />
                        ))}
                    </ul>
                </div>
            ))}
        </>
    );
}

export default List;
