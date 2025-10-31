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
 * @package    block_todo
 * @copyright  2018 David Mudrák <david@moodle.com>
 * @author     2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_todo;

defined('MOODLE_INTERNAL') || die();

use \core\persistent;

/**
 * Persistent model representing a single todo item on the user's list.
 */
class item extends persistent {

    /** Table to store this persistent model instances. */
    const TABLE = 'block_todo';

    /**
     * Return todo items for the current user.
     *
     * @param int|null $groupid Filter for group.
     * @return array
     */
    public static function get_my_todo_items($groupid = null): array {
        global $USER, $DB;

        $params = [
            'usermodified' => $USER->id,
        ];

        if ($groupid && $groupid > 0) {
            $params['groupid'] = $groupid;
        }

        return static::get_records($params, 'duedate, groupid, timecreated', 'ASC');
    }

    /**
     * Get data that will construct the group buttons.
     *
     * @param array $items The items to check.
     * @param bool $includehidden Include hidden items.
     * @param int $currentgroup The curren group id.
     * @return array
     */
    public static function get_group_button_data(array $items, bool $includehidden, int $currentgroup): array {
        $activegroups = [];
        $addedgroups = [];
        foreach ($items as $item) {
            if (
                $item->get('groupid') != 0 &&
                (($includehidden && $item->get('hide') == 1) || $item->get('hide') != 1)
            ) {
                if (!in_array($item->get('groupid'), $addedgroups)) {
                    $groupdata = [];
                    $groupdata['groupid'] = $item->get('groupid');
                    $groupdata['grouptitle'] = get_string('showgroup' . $item->get('groupid'), 'block_todo');
                    $groupdata['groupicon'] = 'fa-star';
                    $groupdata['hideonload'] = false;
                    $activegroups[] = $groupdata;
                    // Mark as added.
                    $addedgroups[] = $item->get('groupid');
                }
            }
        }
        // Add a reset/clear button if we are viewing a group on the page.
        if (!empty($activegroups)) {
            $groupdata = [];
            $groupdata['groupid'] = 0;
            $groupdata['grouptitle'] = get_string('showgroup0', 'block_todo');
            $groupdata['groupicon'] = 'fa-times';
            $groupdata['hideonload'] = $currentgroup == 0;
            $activegroups[] = $groupdata;
        }
        return $activegroups;
    }

    /**
     * Does the list of items contain any hidden items.
     *
     * @param array $items The items to check.
     * @return bool
     */
    public static function has_hidden_items($items): bool {
        foreach ($items as $item) {
            if ($item->get('hide') == 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return the definition of the properties of this model.
     *
     * @return array
     */
    protected static function define_properties(): array {
        return [
            'todotext' => [
                'type' => PARAM_TEXT,
            ],
            'duedate' => [
                'type' => PARAM_INT,
                'required' => false,
                'default' => null,
                'null' => NULL_ALLOWED,
            ],
            'duedateformatted' => [
                'type' => PARAM_TEXT,
                'required' => false,
                'default' => null,
                'null' => NULL_ALLOWED,
            ],
            'overdue' => [
                'type' => PARAM_BOOL,
                'default' => false,
            ],
            'today' => [
                'type' => PARAM_BOOL,
                'default' => false,
            ],
            'done' => [
                'type' => PARAM_BOOL,
                'default' => false,
            ],
            'pin' => [
                'type' => PARAM_BOOL,
                'default' => false,
            ],
            'hide' => [
                'type' => PARAM_BOOL,
                'default' => false,
            ],
            'id' => [
                'type' => PARAM_INT,
                'required' => false,
                'default' => null,
                'null' => NULL_ALLOWED,
            ],
            'groupid' => [
                'type' => PARAM_INT,
                'required' => false,
                'default' => 0,
            ],
        ];
    }

    /**
     * Delete completed items.
     *
     * @param int|null $groupid Filter for group.
     */
    public static function delete_completed_items(): void {
        global $USER, $DB;

        $params = [
            'usermodified' => $USER->id,
            'done' => 1,
        ];

        $DB->delete_records('block_todo', $params);
    }
}
