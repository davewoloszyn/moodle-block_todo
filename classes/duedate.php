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
 * Provides the {@link block_todo\item} class.
 *
 * @package     block_todo
 * @copyright   2018 David Mudrák <david@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_todo;

defined('MOODLE_INTERNAL') || die();

use \core\persistent;

/**
 * Persistent model representing a single todo item on the user's list.
 */
class duedate extends persistent {

    /** Table to store this persistent model instances. */
    const TABLE = 'block_todo';

    /**
     * Return todo items for the current user.
     *
     * @param int $duedate The due date to group by (optional)
     * @return array
     */
    public static function get_my_todo_duedates() {
        global $USER, $DB;

        $params = [
            'usermodified' => $USER->id,
        ];

        return static::get_records($params, 'duedate', 'ASC');

    }

    /**
     * Return the definition of the properties of this model.
     *
     * @return array
     */
    protected static function define_properties() {
        return [
            'duedate' => [
                'type' => PARAM_INT,
                'required' => true,
                'default' => null,
                'null' => true,
            ]
        ];
    }
}
