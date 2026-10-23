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
 * Item group definitions shared by the components.
 *
 * @module     block_todo/groups
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Group 0 is "None"; groups 1-5 are the coloured star groups.
export const GROUP_IDS = [0, 1, 2, 3, 4, 5];

// Each group has its own colour (see styles.css) and its own icon shape,
// so groups can be told apart without relying on colour alone.
export const GROUP_ICONS: Record<number, string> = {
    '1': 'fa-solid fa-star',
    '2': 'fa-solid fa-microchip',
    '3': 'fa-solid fa-tree',
    '4': 'fa-solid fa-flask',
    '5': 'fa-solid fa-fire',
};
