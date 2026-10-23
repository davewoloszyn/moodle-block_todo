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
 * A modal asking the user to confirm an action.
 *
 * @module     block_todo/ConfirmModal
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useState, type ReactNode} from 'react';
import {Button} from '@moodlehq/design-system';
import {getStrings} from '@moodle/lms/core/stringUtils';
import Modal from "./Modal";

interface ConfirmModalProps {
    title: ReactNode;
    onConfirm: () => void;
    onClose: () => void;
    children: ReactNode;
}

function ConfirmModal({title, onConfirm, onClose, children}: ConfirmModalProps) {
    // Button's label must be a plain string, so fetch the translated text up front.
    const [cancelLabel, setCancelLabel] = useState('');
    const [confirmLabel, setConfirmLabel] = useState('');

    useEffect(() => {
        getStrings([
            {key: 'cancel', component: 'core'},
            {key: 'confirm', component: 'core'},
        ]).then(([cancel, confirm]) => {
            setCancelLabel(cancel);
            setConfirmLabel(confirm);
            return;
        });
    }, []);

    return (
        <Modal title={title} onClose={onClose}>
            <div className="modal-body my-4">{children}</div>
            <div className="modal-footer gap-2">
                <Button
                    label={cancelLabel}
                    onClick={onClose}
                    variant="secondary"
                    size="lg"
                />
                <Button
                    label={confirmLabel}
                    onClick={onConfirm}
                    variant="danger"
                    size="lg"
                />
            </div>
        </Modal>
    );
}

export default ConfirmModal;
