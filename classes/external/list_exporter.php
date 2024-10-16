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
 * Provides {@link block_todo\external\list_exporter} class.
 *
 * @package    block_todo
 * @copyright  2018 David Mudrák <david@moodle.com>
 * @author     2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_todo\external;

defined('MOODLE_INTERNAL') || die();

use core\external\exporter;
use renderer_base;
use stdClass;

/**
 * Exporter of the todo list of items.
 */
class list_exporter extends exporter {

    /**
     * Return the list of standard exported properties.
     *
     * @return array
     */
    protected static function define_properties(): array {
        return [
            'instanceid' => [
                'type' => PARAM_INT,
            ],
        ];
    }

    /**
     * Return the list of additional properties.
     *
     * @return array
     */
    protected static function define_other_properties(): array {
        return [
            'items' => [
                'type' => item_exporter::read_properties_definition(),
                'multiple' => true,
                'optional' => false,
            ],
            'pinned' => [
                'type' => item_exporter::read_properties_definition(),
                'multiple' => true,
                'optional' => true,
            ],
            'hidedone' => [
                'type' => PARAM_BOOL,
                'optional' => true,
            ],
        ];
    }

    /**
     * Returns a list of objects that are related.
     *
     * We need the context to be used when formatting the todotext field.
     *
     * @return array
     */
    protected static function define_related(): array {
        return [
            'context' => 'context',
            'items' => 'block_todo\item[]',
        ];
    }

    /**
     * Get the additional values to inject while exporting.
     *
     * @param renderer_base $output The renderer.
     * @return array Keys are the property names, values are their values.
     */
    protected function get_other_values(renderer_base $output): array {
        global $USER, $DB;

        $hiddenitemsids = [];

        // Group the pinned items together.
        $pinneditems = [];
        $pinneditemsids = [];

        foreach ($this->related['items'] as $item) {
            if ($item->get('pin')) {
                $itemexporter = new item_exporter($item, ['context' => $this->related['context']]);

                $date = $itemexporter->data->duedate ?? null;
                $this->format_due_date_data($date, $itemexporter->data);

                $data = $itemexporter->export($output);

                // Add the action menu.
                $actionmenu = $this->get_action_menu(true);
                $data->actions = $actionmenu->export_for_template($output);

                $pinneditems[] = $data;
                $pinneditemsids[] = $item->get('id');
            }
            // Check if any items are in the hidden state.
            if ((bool) $item->get('hide')) {
                $hiddenitemsids[] = $item->get('id');
            }
        }

        // Group all other items together.
        $items = [];

        $params = ['userid' => $USER->id];
        $sql = "SELECT duedate
                  FROM {block_todo}
                 WHERE usermodified = :userid
              GROUP BY duedate";
        $duedates = $DB->get_records_sql($sql, $params);
        ksort($duedates);

        foreach ($duedates as $duedate) {
            $nesteditems = [];
            foreach ($this->related['items'] as $item) {
                // Match duedates to keep them together.
                if($duedate->duedate == $item->get('duedate')){
                    // Keep the pinned and hidden items out of this group of items.
                    if (!in_array($item->get('id'), $pinneditemsids) && !in_array($item->get('id'), $hiddenitemsids)) {
                        $itemexporter = new item_exporter($item, ['context' => $this->related['context']]);
                        $nesteditems[] = $itemexporter->export($output);
                    }
                }
            }

            if (count($nesteditems) > 0) {
                $data = new stdClass();
                $data->nesteditems = $nesteditems;
                $date = $duedate->duedate ?? null;
                $this->format_due_date_data($date, $data);

                // Add the action menu.
                $actionmenu = $this->get_action_menu();
                $data->actions = $actionmenu->export_for_template($output);

                $items[] = $data;
            }
        }

        return [
            'items' => $items,
            'pinned' => $pinneditems,
            'hidedone' => (int) !empty($hiddenitemsids),
        ];
    }

    /**
     * Format due date date to include human-readable time and overdue status.
     *
     * @param int|null $duedate The data object to update.
     */
    protected function format_due_date_data(?int $duedate, stdClass &$data): void {
        if (!$duedate) {
            return;
        }

        $duedateformatted = date("D, j M", $duedate);
        $yesterday = time() - 86400;
        $overdue = ($duedate > $yesterday) ? false : true;

        // Is the duedate today?
        $data->today = false;
        $day = $this->get_day_start_and_end();
        if ($duedate >= $day['start'] && $duedate <= $day['end']) {
            $data->today = true;
        }

        $data->duedate = $duedate;
        $data->overdue = $overdue;
        $data->duedateformatted = $duedateformatted;
    }

    /**
     * Get the timestamps for the start (00:00:00) and end (23:59:59) of the provided day.
     *
     * @param int|null $timestamp The timestamp to base the calculation on.
     * @return array Day start and end timestamps.
     */
    protected function get_day_start_and_end(?int $timestamp = null): array {
        $day = [];
        // Use the time now if no timestamp is provided.
        $timestamp = $timestamp ?? time();
        $date = new \DateTime();
        $date->setTimestamp($timestamp);
        $date->setTime(0, 0, 0);
        $day['start'] = $date->getTimestamp();
        $date->setTime(23, 59, 59);
        $day['end'] = $date->getTimestamp();

        return $day;
    }

    /**
     * Get the action menu for the item.
     *
     * @param bool $ispinned
     * @return \action_menu
     */
    protected function get_action_menu(bool $ispinned = false): \action_menu {
        global $OUTPUT;

        $actionmenu = new \action_menu();
        $pinstring = $ispinned ? get_string('unpin', 'block_todo') : get_string('pin', 'block_todo') ;

        $actionmenu->add(new \action_menu_link(
            new \moodle_url('#'),
            new \pix_icon('pin', $pinstring, 'block_todo'),
            $pinstring,
            false,
            ['data-control' => 'pin'],
        ));

        $actionmenu->add(new \action_menu_link(
            new \moodle_url('#'),
            new \pix_icon('edit', get_string('pin', 'block_todo'), 'block_todo'),
            get_string('edit'),
            false,
            ['data-control' => 'edit'],
        ));

        $actionmenu->add(new \action_menu_link(
            new \moodle_url('#'),
            new \pix_icon('delete', get_string('pin', 'block_todo'), 'block_todo'),
            get_string('delete'),
            false,
            ['data-control' => 'delete'],
        ));

        $classes = 'no-caret dropdown-toggle icon-no-margin text-dark';
        $icon = $OUTPUT->pix_icon('i/menu', get_string('options'));
        $actionmenu->set_menu_trigger($icon, $classes);

        return $actionmenu;
    }
}
