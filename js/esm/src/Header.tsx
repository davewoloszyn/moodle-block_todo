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
 * The block header: the add button, group filters and completed item controls.
 *
 * @module     block_todo/Header
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useState} from 'react';
import {Button, Tooltip} from '@moodlehq/design-system';
import {getStrings} from '@moodle/lms/core/stringUtils';
import {GROUP_IDS, GROUP_ICONS} from "./groups";

interface HeaderProps {
    groupids: number[];
    currentgroup: number;
    hascompleteditems: boolean;
    hidedone: boolean;
    onAdd: () => void;
    onGroup: (groupid: number) => void;
    onToggleHideDone: () => void;
    onDeleteCompleted: () => void;
}

function Header({
    groupids,
    currentgroup,
    hascompleteditems,
    hidedone,
    onAdd,
    onGroup,
    onToggleHideDone,
    onDeleteCompleted,
}: HeaderProps) {
    // Button's label must be a plain string, so fetch the translated text up front.
    const [addLabel, setAddLabel] = useState('');
    const [showCompletedLabel, setShowCompletedLabel] = useState('');
    const [hideCompletedLabel, setHideCompletedLabel] = useState('');
    const [deleteCompletedLabel, setDeleteCompletedLabel] = useState('');

    useEffect(() => {
        getStrings([
            {key: 'additem', component: 'block_todo'},
            {key: 'showcompleted', component: 'block_todo'},
            {key: 'hidecompleted', component: 'block_todo'},
            {key: 'deletecompleted', component: 'block_todo'},
        ]).then(([additem, showcompleted, hidecompleted, deletecompleted]) => {
            setAddLabel(additem);
            setShowCompletedLabel(showcompleted);
            setHideCompletedLabel(hidecompleted);
            setDeleteCompletedLabel(deletecompleted);
            return;
        });
    }, []);

    // The group buttons are icon-only, so their tooltips (which also become their accessible names)
    // must be plain strings too.
    // Fetch all of them, as which groups are shown can change.
    const [groupLabels, setGroupLabels] = useState<string[]>([]);
    useEffect(() => {
        getStrings(GROUP_IDS.map((groupid) => ({key: `showgroup${groupid}`, component: 'block_todo'})))
            .then(setGroupLabels);
    }, []);

    return (
        <div className="mb-3 button-header">
            <div>
                <Button
                    className="add-button"
                    label={addLabel}
                    startIcon={<i aria-hidden="true" className="fa-solid fa-plus" />}
                    onClick={onAdd}
                />
            </div>
            <div className="action-buttons">
                {/* Each Tooltip also gives its icon-only button its accessible name (aria-label). */}
                {groupids.map((groupid) => (
                    <Tooltip key={groupid} label={groupLabels[GROUP_IDS.indexOf(groupid)] ?? ''}>
                        <Button
                            variant="ghost"
                            className={groupid === currentgroup ? 'active' : undefined}
                            aria-pressed={groupid === currentgroup}
                            // Clicking the selected group again shows all groups.
                            onClick={() => onGroup(groupid === currentgroup ? 0 : groupid)}
                            startIcon={
                                <i
                                    className={`${GROUP_ICONS[groupid]} group-icon group-icon-${groupid}`}
                                    aria-hidden="true"
                                />
                            }
                        />
                    </Tooltip>
                ))}
                {hascompleteditems && (
                    <>
                        <Tooltip label={hidedone ? showCompletedLabel : hideCompletedLabel}>
                            <Button
                                variant="ghost"
                                onClick={onToggleHideDone}
                                startIcon={<i className={`fa ${hidedone ? 'fa-eye' : 'fa-eye-slash'}`} aria-hidden="true" />}
                            />
                        </Tooltip>
                        <Tooltip label={deleteCompletedLabel}>
                            <Button
                                variant="ghost"
                                onClick={onDeleteCompleted}
                                startIcon={<i className="fa fa-trash" aria-hidden="true" />}
                            />
                        </Tooltip>
                    </>
                )}
            </div>
        </div>
    );
}

export default Header;
