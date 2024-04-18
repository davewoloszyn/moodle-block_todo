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
                $pinneditems[] = $itemexporter->export($output);
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
                // Prepare date.
                $date = $duedate->duedate ?? null;
                $now = time() - 86400;
                $duedateformatted = $date ? date("D, j M", $date) : 'General';
                $overdue = false;
                if ($date) {
                    $overdue = ($date > $now) ? false : true;
                }
                // Create a new data entry with the nested items.
                $data = new stdClass();
                $data->duedate = $date;
                $data->overdue = $overdue;
                $data->duedateformatted = $duedateformatted;
                $data->nesteditems = $nesteditems;

                $items[] = $data;
            }
        }

        return [
            'items' => $items,
            'pinned' => $pinneditems,
            'hidedone' => (int) !empty($hiddenitemsids)
        ];
    }
}
