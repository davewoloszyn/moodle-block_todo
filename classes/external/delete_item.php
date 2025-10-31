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
 * Provides {@link block_todo\external\delete_item} trait.
 *
 * @package    block_todo
 * @category   external
 * @copyright  2018 David Mudrák <david@moodle.com>
 * @author     2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_todo\external;

defined('MOODLE_INTERNAL') || die();

use block_todo;
use block_todo\item;
use context_user;
use core_external\external_function_parameters;
use core_external\external_value;
use invalid_parameter_exception;

require_once($CFG->libdir.'/externallib.php');

/**
 * Trait implementing the external function block_todo_delete_item.
 */
trait delete_item {

    /**
     * Describes the structure of parameters for the function.
     *
     * @return external_function_parameters
     */
    public static function delete_item_parameters(): external_function_parameters {
        return new external_function_parameters([
            'instanceid' => new external_value(PARAM_INT, 'The instance id'),
            'id' => new external_value(PARAM_INT, 'ID of the todo item'),
            'includehidden' => new external_value(PARAM_BOOL, 'Include hidden items or not', 0),
            'currentgroup' => new external_value(PARAM_INT, 'The current group being viewed', 0),
        ]);
    }

    /**
     * Delete the todo item.
     *
     * @param int $instanceid The instance id.
     * @return int $id The id of the todo item we want to delete.
     * @param bool $includehidden Include hidden items.
     * @param int $currentgroup The current group being viewed.
     * @return string Template HTML.
     */
    public static function delete_item(
        int $instanceid,
        int $id,
        bool $includehidden = true,
        int $currentgroup = 0,
    ): string {
        global $USER, $PAGE;

        // Validate.
        $context = context_user::instance($USER->id);
        self::validate_context($context);
        require_capability('block/todo:myaddinstance', $context);
        $params = ['instanceid' => $instanceid, 'id' => $id];
        $params = self::validate_parameters(self::delete_item_parameters(), $params);

        // Update record.
        $item = item::get_record(['usermodified' => $USER->id, 'id' => $id]);

        if (!$item) {
            throw new invalid_parameter_exception('Unable to find your todo item with that ID');
        }

        $item->delete();

        // Return an updated list.
        $items = block_todo\item::get_my_todo_items();
        // Get group button data.
        $activegroups = block_todo\item::get_group_button_data($items, $includehidden, $currentgroup);
        // Prepare the exporter of the todo items list.
        $list = new block_todo\external\list_exporter([
            'instanceid' => $instanceid,
        ], [
            'items' => $items,
            'context' => $context,
            'activegroups' => $activegroups,
            'currentgroup' => $currentgroup,
        ]);

        $output = $PAGE->get_renderer('core');
        return $output->render_from_template('block_todo/list', $list->export($output));
    }

    /**
     * Describes the structure of the function return value.
     *
     * @return external_value
     */
    public static function delete_item_returns(): external_value {
        return new external_value(PARAM_RAW, 'template');
    }
}
