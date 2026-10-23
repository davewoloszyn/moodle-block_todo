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

use core_external\external_function_parameters;
use core_external\external_value;

/**
 * Implementation of the block_todo_add_item web service.
 *
 * Adds a new item to the user's todo list.
 *
 * @package    block_todo
 * @category   external
 * @copyright  2018 David Mudrák <david@moodle.com>
 * @author     2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class add_item extends base {

    /**
     * Describes the parameters.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'todotext' => new external_value(PARAM_TEXT, 'Item text describing what is to be done'),
            'duedate' => new external_value(PARAM_INT, 'Due date timestamp (0 for none)', VALUE_DEFAULT, 0),
            'groupid' => new external_value(PARAM_INT, 'Group id (0 for none)', VALUE_DEFAULT, 0),
        ]);
    }

    /**
     * Adds a new item to the user's todo list.
     *
     * @param string $todotext The item text.
     * @param int $duedate The due date timestamp (0 for none).
     * @param int $groupid The group id (0 for none).
     * @return array The user's updated items.
     */
    public static function execute(string $todotext, int $duedate = 0, int $groupid = 0): array {
        [
            'todotext' => $todotext,
            'duedate' => $duedate,
            'groupid' => $groupid,
        ] = self::validate_parameters(self::execute_parameters(), [
            'todotext' => $todotext,
            'duedate' => $duedate,
            'groupid' => $groupid,
        ]);

        $manager = self::get_manager();
        $manager->add_item($todotext, $duedate, $groupid);

        return self::get_items($manager);
    }
}
