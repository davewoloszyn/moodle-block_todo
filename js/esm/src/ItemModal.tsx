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
 * The modal with the add/edit item form.
 *
 * @module     block_todo/ItemModal
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useId, useEffect, useState, type SubmitEvent, type ReactNode} from 'react';
import {Button, Tooltip} from '@moodlehq/design-system';
import String from "@moodle/lms/core/String";
import {getStrings} from '@moodle/lms/core/stringUtils';
import Modal from "./Modal";
import {GROUP_IDS, GROUP_ICONS} from "./groups";

// Date input value (YYYY-MM-DD) to a timestamp at local midnight, or 0 for no date.
const toTimestamp = (value: string) => {
    if (!value) {
        return 0;
    }
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day).getTime() / 1000;
};

// Timestamp to a date input value (YYYY-MM-DD), or '' for no date.
const toDateValue = (timestamp: number | null) => {
    if (!timestamp) {
        return '';
    }
    const date = new Date(timestamp * 1000);
    const pad = (n: number) => `${n}`.padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

interface ItemModalProps {
    title: ReactNode;
    // The item being edited, or undefined when adding a new item.
    item?: any;
    onSubmit: (todotext: string, duedate: number, groupid: number) => void;
    onClose: () => void;
}

// A modal with the add/edit item form.
function ItemModal({title, item, onSubmit, onClose}: ItemModalProps) {
    const id = useId();
    const [selectedgroup, setSelectedgroup] = useState(item?.groupid ?? 0);

    // Button's label must be a plain string, so fetch the translated text up front.
    const [cancelLabel, setCancelLabel] = useState('');
    const [saveChangesLabel, setSaveChangesLabel] = useState('');
    const [addLabel, setAddLabel] = useState('');
    // The group buttons are icon-only, so they need their names as plain strings too.
    const [groupLabels, setGroupLabels] = useState<string[]>([]);

    useEffect(() => {
        getStrings([
            {key: 'cancel', component: 'core'},
            {key: 'savechanges', component: 'core'},
            {key: 'add', component: 'core'},
            ...GROUP_IDS.map((groupid) => ({key: `labelgroup${groupid}`, component: 'block_todo'})),
        ]).then(([cancel, savechanges, add, ...groups]) => {
            setCancelLabel(cancel);
            setSaveChangesLabel(savechanges);
            setAddLabel(add);
            setGroupLabels(groups);
            return;
        });
    }, []);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const todotext = `${data.get('todotext') ?? ''}`.trim();
        if (!todotext) {
            return;
        }
        onSubmit(todotext, toTimestamp(`${data.get('duedate') ?? ''}`), Number(data.get('groupid') ?? 0));
    }

    return (
        <Modal title={title} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="modal-body my-4">
                    <div className="mb-3">
                        <label htmlFor={`${id}-text`}>
                            <String identifier="itemname" component="block_todo" />
                        </label>
                        <input
                            id={`${id}-text`}
                            type="text"
                            name="todotext"
                            className="form-control"
                            maxLength={125}
                            defaultValue={item?.todotext ?? ''}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor={`${id}-duedate`}>
                            <String identifier="duedate" component="block_todo" />
                        </label>
                        <input
                            id={`${id}-duedate`}
                            type="date"
                            name="duedate"
                            className="form-control"
                            defaultValue={toDateValue(item?.duedate ?? null)}
                        />
                    </div>
                    <div className="mb-3">
                        <div id={`${id}-group-label`}>
                            <String identifier="group" component="block_todo" />
                        </div>
                        <div
                            role="group"
                            aria-labelledby={`${id}-group-label`}
                            className="action-buttons"
                        >
                            {/* Each Tooltip also gives its icon-only button its accessible name (aria-label). */}
                            {GROUP_IDS.map((groupid) => (
                                <Tooltip key={groupid} label={groupLabels[GROUP_IDS.indexOf(groupid)] ?? ''}>
                                    <Button
                                        variant="ghost"
                                        className={groupid === selectedgroup ? 'active' : undefined}
                                        aria-pressed={groupid === selectedgroup}
                                        onClick={() => setSelectedgroup(groupid)}
                                        startIcon={
                                            <i
                                                className={groupid > 0
                                                    ? `${GROUP_ICONS[groupid]} group-icon group-icon-${groupid}`
                                                    : 'fa-solid fa-ban'}
                                                aria-hidden="true"
                                            />
                                        }
                                    />
                                </Tooltip>
                            ))}
                        </div>
                        {/* The buttons aren't form fields, so this carries the chosen group into FormData. */}
                        <input type="hidden" name="groupid" value={selectedgroup} />
                    </div>
                </div>
                <div className="modal-footer gap-2">
                    <Button
                        label={cancelLabel}
                        onClick={onClose}
                        variant="secondary"
                        size="lg"
                    />
                    <Button
                        label={item ? saveChangesLabel : addLabel}
                        variant="primary"
                        type="submit"
                        size="lg"
                    />
                </div>
            </form>
        </Modal>
    );
}

export default ItemModal;
