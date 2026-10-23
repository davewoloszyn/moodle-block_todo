<?php
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

namespace block_todo;

use context;
use invalid_parameter_exception;

/**
 * Manages the todo items of a single user.
 *
 * This is the only class that reads from or writes to the block_todo table.
 *
 * @package    block_todo
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class manager {

    /** @var string The database table. */
    public const TABLE = 'block_todo';

    /**
     * Constructor.
     *
     * @param int $userid The user whose items are managed.
     */
    public function __construct(
        protected int $userid,
    ) {
    }

    /**
     * Get all of the user's items.
     *
     * @return item[]
     */
    public function get_items(): array {
        global $DB;

        $records = $DB->get_records(self::TABLE, ['usermodified' => $this->userid], 'duedate, groupid, timecreated');
        return array_values(array_map(fn($record) => item::from_record($record), $records));
    }

    /**
     * Get all of the user's items, exported for the frontend.
     *
     * @param context $context The context used to format the text.
     * @return array
     */
    public function export_items(context $context): array {
        return array_map(fn(item $item) => $item->export($context), $this->get_items());
    }

    /**
     * Get one of the user's items.
     *
     * @param int $id The item id.
     * @return item
     * @throws invalid_parameter_exception If the user has no item with that id.
     */
    public function get_item(int $id): item {
        global $DB;

        $record = $DB->get_record(self::TABLE, ['id' => $id, 'usermodified' => $this->userid]);
        if (!$record) {
            throw new invalid_parameter_exception('Unable to find your todo item with that ID');
        }
        return item::from_record($record);
    }

    /**
     * Add a new item.
     *
     * @param string $todotext The item text.
     * @param int|null $duedate The due date timestamp, if any.
     * @param int $groupid The group the item belongs to (0 for none).
     * @return item The new item.
     */
    public function add_item(string $todotext, ?int $duedate = null, int $groupid = 0): item {
        global $DB;

        $now = time();
        $item = new item(
            id: 0,
            usermodified: $this->userid,
            todotext: $todotext,
            duedate: $duedate ?: null,
            done: false,
            pin: false,
            hide: false,
            groupid: $groupid,
            timecreated: $now,
            timemodified: $now,
        );
        $record = $item->to_record();
        unset($record->id);
        $item->id = $DB->insert_record(self::TABLE, $record);

        return $item;
    }

    /**
     * Change the text, due date and group of an item.
     *
     * @param int $id The item id.
     * @param string $todotext The new item text.
     * @param int|null $duedate The new due date timestamp, if any.
     * @param int $groupid The new group (0 for none).
     * @return item The updated item.
     */
    public function edit_item(int $id, string $todotext, ?int $duedate = null, int $groupid = 0): item {
        $item = $this->get_item($id);
        $item->todotext = $todotext;
        $item->duedate = $duedate ?: null;
        $item->groupid = $groupid;
        $this->save($item);

        return $item;
    }

    /**
     * Toggle the done status of an item.
     *
     * @param int $id The item id.
     * @param bool $hide Whether the item should be hidden (used while completed items are hidden).
     * @return item The updated item.
     */
    public function toggle_done(int $id, bool $hide = false): item {
        $item = $this->get_item($id);
        $item->done = !$item->done;
        $item->hide = $hide;
        $this->save($item);

        return $item;
    }

    /**
     * Toggle the pinned status of an item.
     *
     * @param int $id The item id.
     * @return item The updated item.
     */
    public function toggle_pin(int $id): item {
        $item = $this->get_item($id);
        $item->pin = !$item->pin;
        $this->save($item);

        return $item;
    }

    /**
     * Delete an item.
     *
     * @param int $id The item id.
     */
    public function delete_item(int $id): void {
        global $DB;

        $item = $this->get_item($id);
        $DB->delete_records(self::TABLE, ['id' => $item->id]);
    }

    /**
     * Hide or show all completed items.
     *
     * @param bool $hide Whether to hide them.
     */
    public function set_done_items_hidden(bool $hide): void {
        global $DB;

        $DB->set_field(self::TABLE, 'hide', (int) $hide, ['usermodified' => $this->userid, 'done' => 1]);
    }

    /**
     * Delete all completed items.
     */
    public function delete_done_items(): void {
        global $DB;

        $DB->delete_records(self::TABLE, ['usermodified' => $this->userid, 'done' => 1]);
    }

    /**
     * Save changes to an existing item.
     *
     * @param item $item The item.
     */
    protected function save(item $item): void {
        global $DB;

        $item->timemodified = time();
        $DB->update_record(self::TABLE, $item->to_record());
    }
}
