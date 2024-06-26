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
 * Provides {@link block_todo\external\api} class.
 *
 * @package     block_todo
 * @category    external
 * @copyright   2018 David Mudrák <david@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_todo\external;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir.'/externallib.php');

use core_external\external_api;

/**
 * Provides an external API of the block.
 *
 * Each external function is implemented in its own trait. This class
 * aggregates them all.
 *
 * @copyright 2018 David Mudrák <david@moodle.com>
 * @author    2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class api extends external_api {

    use add_item;
    use toggle_item;
    use delete_item;
    use edit_item;
    use pin_item;
    use hide_done_items;
}
