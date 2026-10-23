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
 * Block todo is defined here.
 *
 * @package    block_todo
 * @copyright  2018 David Mudrák <david@moodle.com>
 * @author     2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * todo block.
 *
 * @package    block_todo
 * @copyright  2018 David Mudrák <david@moodle.com>
 * @author     2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_todo extends block_base {

    /**
     * Initialises class member variables.
     */
    public function init(): void {
        // Needed by Moodle to differentiate between blocks.
        $this->title = get_string('pluginname', 'block_todo');
    }

    /**
     * Returns the block contents.
     *
     * @return stdClass The block contents.
     */
    public function get_content(): \stdClass {
        global $USER;

        if ($this->content !== null) {
            return $this->content;
        }

        $this->content = new stdClass();

        if (empty($this->instance)) {
            return $this->content;
        }

        // The block always shows the current user's own list, wherever it is placed. There is no list to show to
        // guests or users who are not logged in, nor to users who cannot manage their items. With no content, the
        // block is not displayed.
        if (!isloggedin() || isguestuser()) {
            return $this->content;
        }
        $usercontext = context_user::instance($USER->id);
        if (!has_capability('block/todo:manageitems', $usercontext)) {
            return $this->content;
        }

        $manager = new block_todo\manager($USER->id);

        $this->content->text = \core\output\html_writer::react_component(
            '@moodle/lms/block_todo/App',
            [
                'instanceid' => $this->instance->id,
                // Format in the user's own context, as the web services do, so items look the same on every page.
                'items' => $manager->export_items($usercontext),
            ],
        );

        return $this->content;
    }

    /**
     * Defines configuration data.
     *
     * The function is called immediatly after init().
     */
    public function specialization(): void {
        // Load user defined title and make sure it's never empty.
        if (empty($this->config->title)) {
            $this->title = get_string('pluginname', 'block_todo');
        } else {
            $this->title = $this->config->title;
        }
    }

    /**
     * Sets the applicable formats for the block.
     *
     * @return array Array of pages and permissions.
     */
    public function applicable_formats(): array {
        // The list is personal, so it can be shown on any page, apart from site administration.
        return [
            'all' => true,
            'admin' => false,
        ];
    }
}
