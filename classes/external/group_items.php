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
 * Provides {@link block_todo\external\group_items} trait.
 *
 * @package    block_todo
 * @category   external
 * @copyright  2025 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_todo\external;

defined('MOODLE_INTERNAL') || die();

use block_todo;
use context_user;
use core_external\external_function_parameters;
use core_external\external_value;

require_once($CFG->libdir.'/externallib.php');

/**
 * Trait implementing the external function block_todo_group_items.
 */
trait group_items {

    /**
     * Describes the structure of parameters for the function.
     *
     * @return external_function_parameters
     */
    public static function group_items_parameters(): external_function_parameters {
        return new external_function_parameters([
            'instanceid' => new external_value(PARAM_INT, 'The instance id'),
            'groupid' => new external_value(PARAM_INT, 'The group id to group', 0),
            'includehidden' => new external_value(PARAM_BOOL, 'Include hidden items or not', 0),
        ]);
    }

    /**
     * Toggle the grouping of items.
     *
     * @param int $instanceid The instance id.
     * @param int $groupid The group id to use.
     * @param bool $includehidden Include hidden items.
     * @return string Template HTML.
     */
    public static function group_items(
        int $instanceid,
        int $groupid,
        bool $includehidden = true
    ): string {
        global $USER, $PAGE, $DB;

        // Validate.
        $context = context_user::instance($USER->id);
        self::validate_context($context);
        require_capability('block/todo:myaddinstance', $context);
        $params = ['instanceid' => $instanceid, 'groupid' => $groupid];
        $params = self::validate_parameters(self::group_items_parameters(), $params);

        // Return an updated list that matches the group id.
        $items = block_todo\item::get_my_todo_items();
        if ($groupid != 0) {
            $items = array_filter($items, function($item) use ($groupid): bool {
                return $item->get('groupid') == $groupid;
            });
        }

        if ($groupid == 0) {
            // Determine if there are hidden items. If so, we respect that when displaying the list.
            $includehidden = block_todo\item::has_hidden_items($items);
        }

        // Get group button data.
        $activegroups = block_todo\item::get_group_button_data($items, $includehidden, $groupid);

        // Prepare the exporter of the todo items list.
        $list = new block_todo\external\list_exporter([
            'instanceid' => $instanceid,
        ], [
            'items' => $items,
            'context' => $context,
            'activegroups' => $activegroups,
            'currentgroup' => $groupid
        ]);

        $output = $PAGE->get_renderer('core');
        return $output->render_from_template('block_todo/content', $list->export($output));
    }

    /**
     * Describes the structure of the function return value.
     *
     * @return external_value
     */
    public static function group_items_returns(): external_value {
        return new external_value(PARAM_RAW, 'template');
    }
}
