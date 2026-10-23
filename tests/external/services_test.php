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

use core_external\external_api;

/**
 * Tests for the block_todo web services.
 *
 * @package    block_todo
 * @category   test
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(base::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(add_item::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(edit_item::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(toggle_item::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(pin_item::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(delete_item::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(hide_done_items::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(delete_completed::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(\block_todo\manager::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(\block_todo\item::class)]
final class services_test extends \core_external\tests\externallib_testcase {

    /** @var \stdClass The user who owns the items. */
    protected \stdClass $user;

    #[\Override]
    protected function setUp(): void {
        parent::setUp();
        $this->resetAfterTest();

        $this->user = $this->getDataGenerator()->create_user();
        $this->setUser($this->user);
    }

    /**
     * Add an item through the web service and return the cleaned item list.
     *
     * @param string $todotext The item text.
     * @param int $duedate The due date.
     * @param int $groupid The group id.
     * @return array
     */
    protected function add(string $todotext, int $duedate = 0, int $groupid = 0): array {
        $result = add_item::execute($todotext, $duedate, $groupid);
        return external_api::clean_returnvalue(add_item::execute_returns(), $result);
    }

    public function test_add_item(): void {
        $items = $this->add('Meditate!', 1700000000, 2);

        $this->assertCount(1, $items);
        $this->assertSame('Meditate!', $items[0]['todotext']);
        $this->assertSame(1700000000, $items[0]['duedate']);
        $this->assertSame(2, $items[0]['groupid']);
        $this->assertFalse($items[0]['done']);
        $this->assertFalse($items[0]['pin']);
        $this->assertFalse($items[0]['hide']);
    }

    public function test_add_item_without_duedate(): void {
        $items = $this->add('No rush');

        $this->assertNull($items[0]['duedate']);
    }

    public function test_add_item_no_permission(): void {
        $userroles = get_archetype_roles('user');
        $authrole = array_pop($userroles);
        unassign_capability('block/todo:manageitems', $authrole->id);

        $this->expectException(\required_capability_exception::class);
        add_item::execute('This should throw required_capability_exception');
    }

    public function test_edit_item(): void {
        $id = $this->add('Write a unit test')[0]['id'];

        $result = edit_item::execute($id, 'Write two unit tests', 0, 3);
        $items = external_api::clean_returnvalue(edit_item::execute_returns(), $result);

        $this->assertSame('Write two unit tests', $items[0]['todotext']);
        $this->assertNull($items[0]['duedate']);
        $this->assertSame(3, $items[0]['groupid']);
    }

    public function test_toggle_item(): void {
        $id = $this->add('Write a unit test')[0]['id'];

        $items = external_api::clean_returnvalue(toggle_item::execute_returns(), toggle_item::execute($id));
        $this->assertTrue($items[0]['done']);

        $items = external_api::clean_returnvalue(toggle_item::execute_returns(), toggle_item::execute($id));
        $this->assertFalse($items[0]['done']);
    }

    public function test_toggle_item_by_another_user(): void {
        $id = $this->add('This is my todo!')[0]['id'];

        $this->setUser($this->getDataGenerator()->create_user());
        $this->expectException(\invalid_parameter_exception::class);
        toggle_item::execute($id);
    }

    public function test_pin_item(): void {
        $id = $this->add('Pin me')[0]['id'];

        $items = external_api::clean_returnvalue(pin_item::execute_returns(), pin_item::execute($id));
        $this->assertTrue($items[0]['pin']);

        $items = external_api::clean_returnvalue(pin_item::execute_returns(), pin_item::execute($id));
        $this->assertFalse($items[0]['pin']);
    }

    public function test_delete_item(): void {
        $this->add('Keep me');
        $items = $this->add('Delete me');
        $id = array_values(array_filter($items, fn($item) => $item['todotext'] === 'Delete me'))[0]['id'];

        $items = external_api::clean_returnvalue(delete_item::execute_returns(), delete_item::execute($id));

        $this->assertCount(1, $items);
        $this->assertSame('Keep me', $items[0]['todotext']);
    }

    public function test_delete_item_by_another_user(): void {
        $id = $this->add('This is not yours!')[0]['id'];

        $this->setUser($this->getDataGenerator()->create_user());
        $this->expectException(\invalid_parameter_exception::class);
        delete_item::execute($id);
    }

    public function test_hide_done_items(): void {
        $this->add('Not done');
        $items = $this->add('Done');
        $doneid = array_values(array_filter($items, fn($item) => $item['todotext'] === 'Done'))[0]['id'];
        toggle_item::execute($doneid);

        $items = external_api::clean_returnvalue(hide_done_items::execute_returns(), hide_done_items::execute(true));
        $hidden = array_column($items, 'hide', 'todotext');
        $this->assertTrue($hidden['Done']);
        $this->assertFalse($hidden['Not done']);

        $items = external_api::clean_returnvalue(hide_done_items::execute_returns(), hide_done_items::execute(false));
        $this->assertFalse(array_column($items, 'hide', 'todotext')['Done']);
    }

    public function test_delete_completed(): void {
        $this->add('Not done');
        $items = $this->add('Done');
        $doneid = array_values(array_filter($items, fn($item) => $item['todotext'] === 'Done'))[0]['id'];
        toggle_item::execute($doneid);

        $items = external_api::clean_returnvalue(delete_completed::execute_returns(), delete_completed::execute());

        $this->assertCount(1, $items);
        $this->assertSame('Not done', $items[0]['todotext']);
    }

    public function test_items_are_per_user(): void {
        $this->add('Mine');

        $this->setUser($this->getDataGenerator()->create_user());
        $items = $this->add('Theirs');

        $this->assertCount(1, $items);
        $this->assertSame('Theirs', $items[0]['todotext']);
    }
}
