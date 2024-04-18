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
        global $OUTPUT;

        if ($this->content !== null) {
            return $this->content;
        }

        if (empty($this->instance)) {
            $this->content = '';
            return $this->content;
        }

        $this->content = new stdClass();

        // Get items for the list.
        $items = block_todo\item::get_my_todo_items();

        // Prepare the exporter of the todo items list.
        $list = new block_todo\external\list_exporter([
            'instanceid' => $this->instance->id,
        ], [
            'items' => $items,
            'context' => $this->context,
        ]);

        // Render the list using a template and exported data.
        $this->content->text = $OUTPUT->render_from_template('block_todo/content', $list->export($OUTPUT));

        return $this->content;
    }

    /**
     * Gets Javascript required for the widget functionality.
     */
    public function get_required_javascript(): void {
        parent::get_required_javascript();
        $this->page->requires->js_call_amd('block_todo/control', 'init', [
            'instanceid' => $this->instance->id
        ]);
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
        return [
            'my' => true,
        ];
    }
}
