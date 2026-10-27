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
 * Provides {@link block_todo\external\edit_item} trait.
 *
 * @package    block_todo
 * @category   external
 * @copyright  2023 David Woloszyn <david.woloszyn@moodle.com>
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
 * Trait implementing the external function block_todo_edit_item.
 */
trait edit_item {

    /**
     * Describes the structure of parameters for the function.
     *
     * @return external_function_parameters
     */
    public static function edit_item_parameters(): external_function_parameters {
        return new external_function_parameters([
            'instanceid' => new external_value(PARAM_INT, 'The instance id'),
            'id' => new external_value(PARAM_INT, 'Id of item'),
            'todotext' => new external_value(PARAM_TEXT, 'Item text describing what is to be done'),
            'duedate' => new external_value(PARAM_INT, 'Due date of item', 0),
            'groupid' => new external_value(PARAM_INT, 'Item belongs to this group', 0),
            'includehidden' => new external_value(PARAM_BOOL, 'Include hidden items or not', 0),
            'currentgroup' => new external_value(PARAM_INT, 'The current group being viewed', 0),
        ]);
    }

    /**
     * Adds a new todo item.
     *
     * @param int $instanceid The instance id.
     * @param int $id The id of the item.
     * @param string $todotext Item text.
     * @param ?int $duedate Due date.
     * @param int $groupid The group id (0 if none).
     * @param bool $includehidden Include hidden items.
     * @param int $currentgroup The current group being viewed.
     * @return string Template HTML.
     */
    public static function edit_item(
        int $instanceid,
        int $id,
        string $todotext,
        ?int $duedate,
        int $groupid,
        bool $includehidden = true,
        int $currentgroup = 0,
    ): string {
        global $USER, $PAGE;

        // Validate.
        $context = context_user::instance($USER->id);
        self::validate_context($context);
        require_capability('block/todo:myaddinstance', $context);
        $params = [
            'instanceid' => $instanceid,
            'id' => $id,
            'todotext' => strip_tags($todotext),
            'duedate' => $duedate,
            'groupid' => $groupid,
        ];
        $params = self::validate_parameters(self::edit_item_parameters(), $params);

        // Update record.
        $item = item::get_record(['usermodified' => $USER->id, 'id' => $id]);

        if (!$item) {
            throw new invalid_parameter_exception('Unable to find your todo item with that ID');
        }

        $item->set('todotext', $todotext);
        $item->set('duedate', $duedate);
        $item->set('groupid', $groupid);
        $item->update();

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
    public static function edit_item_returns(): external_value {
        return new external_value(PARAM_RAW, 'template');
    }
}
