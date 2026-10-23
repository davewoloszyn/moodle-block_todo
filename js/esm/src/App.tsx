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
 * Root component of the ToDo block.
 *
 * Mounted automatically via data-react-component="@moodle/lms/block_todo/App" by core/react_autoinit.
 * Owns the item list state and handles all actions on it.
 *
 * @module     block_todo/App
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useState} from 'react';
import {requireAsync} from '@moodle/lms/core/amd';
import String from "@moodle/lms/core/String";
import Header from "./Header";
import List from "./List";
import ConfirmModal from "./ConfirmModal";
import ItemModal from "./ItemModal";
import {addItem, editItem, toggleItem, pinItem, deleteItem, hideDoneItems, deleteCompleted} from "./repository";

// The part of the core/notification AMD module used here.
interface NotificationModule {
    exception: (exception: unknown) => void;
}

// Show a failed web service call to the user with Moodle's standard error dialog.
const showError = (exception: unknown) => {
    requireAsync<NotificationModule>('core/notification')
        .then((notification) => notification.exception(exception));
};

interface AppProps {
    instanceid: number;
    items: any[];
}

function App({instanceid, items: initialitems}: AppProps) {
    const [items, setItems] = useState(initialitems);
    const [selectedgroup, setSelectedgroup] = useState(0);
    // Which dialog is open (if any), and the item it is for.
    const [dialog, setDialog] = useState<null | 'add' | 'edit' | 'delete' | 'deletecompleted'>(null);
    const [dialogitem, setDialogItem] = useState<any>(null);

    // Values derived from the items.
    const groupids = [...new Set(items.filter((item) => item.groupid > 0).map((item) => item.groupid))]
        .sort((a, b) => a - b);
    const hascompleteditems = items.some((item) => item.done);
    const hidedone = items.some((item) => item.hide);
    // Fall back to all groups if the selected group no longer has any items.
    const currentgroup = groupids.includes(selectedgroup) ? selectedgroup : 0;
    const visibleitems = items.filter((item) => !item.hide && (currentgroup === 0 || item.groupid === currentgroup));

    // Run a web service call, then show the updated items it returns.
    const update = (request: Promise<any[]>) => {
        request.then(setItems).catch(showError);
    };

    const openDialog = (name: typeof dialog, item: any = null) => {
        setDialogItem(item);
        setDialog(name);
    };

    const closeDialog = () => {
        setDialog(null);
        setDialogItem(null);
    };

    return (
        <div data-region={`block_todo-instance-${instanceid}`}>
            <Header
                groupids={groupids}
                currentgroup={currentgroup}
                hascompleteditems={hascompleteditems}
                hidedone={hidedone}
                onAdd={() => openDialog('add')}
                onGroup={setSelectedgroup}
                onToggleHideDone={() => update(hideDoneItems(!hidedone))}
                onDeleteCompleted={() => openDialog('deletecompleted')}
            />
            <List
                items={visibleitems}
                // While completed items are hidden, an item being marked as done is hidden too.
                onToggle={(item) => update(toggleItem(item.id, hidedone && !item.done))}
                onPin={(item) => update(pinItem(item.id))}
                onEdit={(item) => openDialog('edit', item)}
                onDelete={(item) => openDialog('delete', item)}
            />

            {dialog === 'add' && (
                <ItemModal
                    title={<String identifier="additem" component="block_todo" />}
                    onClose={closeDialog}
                    onSubmit={(todotext, duedate, groupid) => {
                        update(addItem(todotext, duedate, groupid));
                        closeDialog();
                    }}
                />
            )}
            {dialog === 'edit' && (
                <ItemModal
                    title={<String identifier="edititem" component="block_todo" />}
                    item={dialogitem}
                    onClose={closeDialog}
                    onSubmit={(todotext, duedate, groupid) => {
                        update(editItem(dialogitem.id, todotext, duedate, groupid));
                        closeDialog();
                    }}
                />
            )}
            {dialog === 'delete' && (
                <ConfirmModal
                    title={<String identifier="deleteitem" component="block_todo" />}
                    onClose={closeDialog}
                    onConfirm={() => {
                        update(deleteItem(dialogitem.id));
                        closeDialog();
                    }}
                >
                    <String identifier="confirmdeletesingle" component="block_todo" params={dialogitem.todotext} />
                </ConfirmModal>
            )}
            {dialog === 'deletecompleted' && (
                <ConfirmModal
                    title={<String identifier="deletecompleted" component="block_todo" />}
                    onClose={closeDialog}
                    onConfirm={() => {
                        update(deleteCompleted());
                        closeDialog();
                    }}
                >
                    <String identifier="confirmdeletecompleted" component="block_todo" />
                </ConfirmModal>
            )}
        </div>
    );
}

export default App;
