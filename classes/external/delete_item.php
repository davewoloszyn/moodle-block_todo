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
 * Implementation of the block_todo_delete_item web service.
 *
 * Deletes an item.
 *
 * @package    block_todo
 * @category   external
 * @copyright  2018 David Mudrák <david@moodle.com>
 * @author     2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class delete_item extends base {

    /**
     * Describes the parameters.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'id' => new external_value(PARAM_INT, 'Item id'),
        ]);
    }

    /**
     * Deletes an item.
     *
     * @param int $id The item id.
     * @return array The user's updated items.
     */
    public static function execute(int $id): array {
        ['id' => $id] = self::validate_parameters(self::execute_parameters(), ['id' => $id]);

        $manager = self::get_manager();
        $manager->delete_item($id);

        return self::get_items($manager);
    }
}
