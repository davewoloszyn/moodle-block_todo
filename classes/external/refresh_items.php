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

/**
 * Provides {@link block_todo\external\refresh_items} trait.
 *
 * @package     block_todo
 * @category    external
 * @copyright   2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_todo\external;

defined('MOODLE_INTERNAL') || die();

use block_todo\item;
use block_todo\duedate;
use context_user;
use external_function_parameters;
use external_value;

require_once($CFG->libdir . '/externallib.php');

/**
 * Trait implementing the external function block_todo_refresh_items.
 */
trait refresh_items {

    /**
     * Describes the structure of parameters for the function.
     *
     * @return external_function_parameters
     */
    public static function refresh_items_parameters() {
        return new external_function_parameters([
            'instanceid' => new external_value(PARAM_INT, 'Instance id'),
            'contextid' => new external_value(PARAM_INT, 'Context id'),
        ]);
    }

    /**
     * Get items.
     *
     * @param int $instanceid Instance id
     * @param int $contextid Context id
     */
    public static function refresh_items(int $instanceid, int $contextid) {
        global $USER, $PAGE;

        $context = context_user::instance($USER->id);
        self::validate_context($context);
        require_capability('block/todo:myaddinstance', $context);

        $params = self::validate_parameters(self::refresh_items_parameters(), compact('instanceid', 'contextid'));

        // Load the list of persistent todo item models from the database.
        $items = item::get_my_todo_items();
        $duedates = duedate::get_my_todo_duedates();

        // Prepare the exporter of the todo items list.
        $list = new list_exporter([
            'instanceid' => $params['instanceid'],
        ], [
            'items' => $items,
            'duedates' => $duedates,
            'context' => \context::instance_by_id($params['contextid']),
        ]);

        return $list->export($PAGE->get_renderer('core'));
    }

    /**
     * Describes the structure of the function return value.
     *
     * @return external_single_structure
     */
    public static function refresh_items_returns() {
        return list_exporter::get_read_structure();
    }
}