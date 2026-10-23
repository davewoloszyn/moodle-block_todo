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
 * The actions menu (pin, edit, delete) shown on each item.
 *
 * @module     block_todo/ItemActions
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useState} from 'react';
import {Dropdown, DropdownItemAction, DropdownItemDivider} from '@moodlehq/design-system';
import {getStrings} from '@moodle/lms/core/stringUtils';

interface ItemActionsProps {
    item: any;
    onPin: (item: any) => void;
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
}

// The actions menu (pin, edit, delete) shown on each item.
function ItemActions({item, onPin, onEdit, onDelete}: ItemActionsProps) {
    const [open, setOpen] = useState(false);

    // Dropdown labels must be plain strings, so fetch the translated text up front.
    const [labels, setLabels] = useState({actions: '', pin: '', unpin: '', edit: '', remove: ''});
    useEffect(() => {
        getStrings([
            {key: 'actions', component: 'core'},
            {key: 'pin', component: 'block_todo'},
            {key: 'unpin', component: 'block_todo'},
            {key: 'edit', component: 'core'},
            {key: 'delete', component: 'core'},
        ]).then(([actions, pin, unpin, edit, remove]) => {
            setLabels({actions, pin, unpin, edit, remove});
            return;
        });
    }, []);

    // Close the menu before running the action, as edit and delete open a modal.
    const run = (action: (item: any) => void) => {
        setOpen(false);
        action(item);
    };

    return (
        <Dropdown
            className="ms-auto"
            label={labels.actions}
            iconOnly
            appearance="subtle"
            size="md"
            placement="bottom-end"
            startIcon={<i className="fa fa-ellipsis-vertical" aria-hidden="true" />}
            open={open}
            onOpenChange={setOpen}
        >
            <DropdownItemAction
                label={item.pin ? labels.unpin : labels.pin}
                startIcon={<i className="fa fa-thumbtack" aria-hidden="true" />}
                onClick={() => run(onPin)}
            />
            <DropdownItemAction
                label={labels.edit}
                startIcon={<i className="fa fa-pen" aria-hidden="true" />}
                onClick={() => run(onEdit)}
            />
            <DropdownItemDivider />
            <DropdownItemAction
                label={labels.remove}
                variant="danger"
                startIcon={<i className="fa fa-trash-can" aria-hidden="true" />}
                onClick={() => run(onDelete)}
            />
        </Dropdown>
    );
}

export default ItemActions;
