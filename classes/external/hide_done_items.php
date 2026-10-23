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
 * Implementation of the block_todo_hide_done_items web service.
 *
 * Hides or shows all completed items.
 *
 * @package    block_todo
 * @category   external
 * @copyright  2018 David Mudrák <david@moodle.com>
 * @author     2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class hide_done_items extends base {

    /**
     * Describes the parameters.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'hide' => new external_value(PARAM_BOOL, 'Whether to hide completed items'),
        ]);
    }

    /**
     * Hides or shows all completed items.
     *
     * @param bool $hide Whether to hide completed items.
     * @return array The user's updated items.
     */
    public static function execute(bool $hide): array {
        ['hide' => $hide] = self::validate_parameters(self::execute_parameters(), ['hide' => $hide]);

        $manager = self::get_manager();
        $manager->set_done_items_hidden($hide);

        return self::get_items($manager);
    }
}
