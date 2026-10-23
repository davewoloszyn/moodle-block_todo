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
 * A modal dialog, built on the native dialog element.
 *
 * @module     block_todo/Modal
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useRef, type ReactNode} from 'react';
import String from "@moodle/lms/core/String";

interface ModalProps {
    title: ReactNode;
    onClose: () => void;
    children: ReactNode;
}

// A modal dialog. Render it to open it, stop rendering it to close it.
// The children provide the modal-body and modal-footer.
function Modal({title, onClose, children}: ModalProps) {
    const dialog = useRef<HTMLDialogElement>(null);

    // The native showModal() gives us the backdrop, focus trapping and Escape to close.
    useEffect(() => {
        dialog.current?.showModal();
    }, []);

    return (
        <dialog ref={dialog} className="block_todo-modal" onClose={onClose}>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <button type="button" className="btn-close" onClick={onClose}>
                        <span className="visually-hidden">
                            <String identifier="closebuttontitle" component="core" />
                        </span>
                    </button>
                </div>
                {children}
            </div>
        </dialog>
    );
}

export default Modal;
