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

namespace block_todo\external;

use block_todo\manager;
use context_user;
use core_external\external_api;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;

/**
 * Shared behaviour for the block_todo web services.
 *
 * Every service acts on the current user's items and returns the user's full, updated item list.
 *
 * @package    block_todo
 * @category   external
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class base extends external_api {

    /**
     * Validate the current user's context and capability, and return their item manager.
     *
     * @return manager
     */
    protected static function get_manager(): manager {
        global $USER;

        $context = context_user::instance($USER->id);
        self::validate_context($context);
        require_capability('block/todo:manageitems', $context);

        return new manager($USER->id);
    }

    /**
     * Get the current user's items, exported for the frontend.
     *
     * @param manager $manager The current user's item manager.
     * @return array
     */
    protected static function get_items(manager $manager): array {
        global $USER;

        return $manager->export_items(context_user::instance($USER->id));
    }

    /**
     * Describes the return value: the user's full item list.
     *
     * @return external_multiple_structure
     */
    public static function execute_returns(): external_multiple_structure {
        return new external_multiple_structure(
            new external_single_structure([
                'id' => new external_value(PARAM_INT, 'Item id'),
                'todotext' => new external_value(PARAM_RAW, 'Formatted item text'),
                'done' => new external_value(PARAM_BOOL, 'Whether the item is done'),
                'pin' => new external_value(PARAM_BOOL, 'Whether the item is pinned'),
                'hide' => new external_value(PARAM_BOOL, 'Whether the item is hidden'),
                'duedate' => new external_value(PARAM_INT, 'Due date timestamp, or null', VALUE_REQUIRED, null, NULL_ALLOWED),
                'groupid' => new external_value(PARAM_INT, 'Group id (0 for none)'),
            ])
        );
    }
}
