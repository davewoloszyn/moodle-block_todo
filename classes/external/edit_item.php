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
 * @package     block_todo
 * @category    external
 * @copyright   2018 David Mudrák <david@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_todo\external;

defined('MOODLE_INTERNAL') || die();

use block_todo\item;
use context_user;
use external_function_parameters;
use external_value;

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
    public static function edit_item_parameters() {
        return new external_function_parameters([
            'id' => new external_value(PARAM_INT, 'Id of item'),
            'todotext' => new external_value(PARAM_TEXT, 'Item text describing what is to be done'),
            'duedate' => new external_value(PARAM_INT, 'Due date of item'),
        ]);
    }

    /**
     * Adds a new todo item.
     *
     * @param string $todotext Item text
     * @param int $duedate Due date
     */
    public static function edit_item($id, $todotext, $duedate) {
        global $USER, $PAGE;

        $context = context_user::instance($USER->id);
        self::validate_context($context);
        require_capability('block/todo:myaddinstance', $context);

        // Task name.
        $todotext = strip_tags($todotext);
        $params = self::validate_parameters(self::edit_item_parameters(), ['id' => $id, 'todotext' => $todotext, 'duedate' => $duedate]);

        $item = new item(null, (object) $params);
        $item->update();

        $itemexporter = new item_exporter($item, ['context' => $context]);

        return $itemexporter->export($PAGE->get_renderer('core'));
    }

    /**
     * Describes the structure of the function return value.
     *
     * @return external_single_structure
     */
    public static function edit_item_returns() {
        return item_exporter::get_read_structure();
    }
}
