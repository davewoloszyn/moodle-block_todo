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
use stdClass;

/**
 * A single todo item.
 *
 * @package    block_todo
 * @copyright  2018 David Mudrák <david@moodle.com>
 * @author     2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class item {

    /**
     * Constructor.
     *
     * @param int $id The item id.
     * @param int $usermodified The id of the user who owns the item.
     * @param string $todotext The item text.
     * @param int|null $duedate The due date timestamp, if any.
     * @param bool $done Whether the item is done.
     * @param bool $pin Whether the item is pinned.
     * @param bool $hide Whether the item is hidden.
     * @param int $groupid The group the item belongs to (0 for none).
     * @param int $timecreated When the item was created.
     * @param int $timemodified When the item was last modified.
     */
    public function __construct(
        public int $id,
        public int $usermodified,
        public string $todotext,
        public ?int $duedate,
        public bool $done,
        public bool $pin,
        public bool $hide,
        public int $groupid,
        public int $timecreated,
        public int $timemodified,
    ) {
    }

    /**
     * Create an item from a block_todo database record.
     *
     * @param stdClass $record The database record.
     * @return item
     */
    public static function from_record(stdClass $record): self {
        return new self(
            id: (int) $record->id,
            usermodified: (int) $record->usermodified,
            todotext: $record->todotext,
            duedate: $record->duedate ? (int) $record->duedate : null,
            done: (bool) $record->done,
            pin: (bool) $record->pin,
            hide: (bool) $record->hide,
            groupid: (int) $record->groupid,
            timecreated: (int) $record->timecreated,
            timemodified: (int) $record->timemodified,
        );
    }

    /**
     * Convert the item to a block_todo database record.
     *
     * @return stdClass
     */
    public function to_record(): stdClass {
        return (object) [
            'id' => $this->id,
            'usermodified' => $this->usermodified,
            'todotext' => $this->todotext,
            'duedate' => $this->duedate,
            'done' => (int) $this->done,
            'pin' => (int) $this->pin,
            'hide' => (int) $this->hide,
            'groupid' => $this->groupid,
            'timecreated' => $this->timecreated,
            'timemodified' => $this->timemodified,
        ];
    }

    /**
     * Export the item for the frontend.
     *
     * The text is not HTML-escaped, as React escapes it when rendering.
     *
     * @param context $context The context used to format the text.
     * @return array
     */
    public function export(context $context): array {
        return [
            'id' => $this->id,
            'todotext' => format_string($this->todotext, true, ['context' => $context, 'escape' => false]),
            'done' => $this->done,
            'pin' => $this->pin,
            'hide' => $this->hide,
            'duedate' => $this->duedate,
            'groupid' => $this->groupid,
        ];
    }
}
