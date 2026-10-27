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
 * Provides the block_todo/control module
 *
 * @category   output
 * @copyright  2018 David Mudrák <david@moodle.com>
 * @author     2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module block_todo/control
 */
define([
        'jquery',
        'core/log',
        'core/ajax',
        'core/templates',
        'core/str',
        'core/modal_factory',
        'core/modal_events'
    ],
    function(
        $,
        Log,
        Ajax,
        Templates,
        Str,
        ModalFactory,
        ModalEvents
    ) {
    'use strict';

    let instanceid = null;

    /**
     * Initializes the block controls.
     *
     * @param {number} id The instance id
     */
    function init(id) {

        var region = $('[data-region="block_todo-instance-' + id + '"]').first();

        if (!region.length) {
            Log.error('block_todo/control: wrapping region not found!');
            return;
        }

        instanceid = id;
        var control = new TodoControl(region);
        control.main();
    }

    /**
     * Controls a single ToDo block instance contents.
     *
     * @constructor
     * @param {jQuery} region
     */
    function TodoControl(region) {
        var self = this;
        self.region = region;
    }

    /**
     * Run the controller.
     *
     */
    TodoControl.prototype.main = function() {
        var self = this;

        self.main = self.region.find('[data-control="main"]');
        self.itemsList = self.region.find('.list-wrapper');
        self.currentHideDone = self.region.find('[data-hidedone]');
        self.currentGroup = self.region.find('[data-currentgroup]');
        self.hideDoneButton = self.region.find('[data-control="hidedone"]');
        self.groupButtons = self.region.find('[data-control="hidedone"]');

        self.initFeatures();
    };

    /**
     * Initialize the controls for adding a new todo item.
     *
     * @method
     */
    TodoControl.prototype.initFeatures = function() {
        var self = this;

        // Reset all event listeners.
        self.main.off();
        self.itemsList.off();

        // Add item.
        self.main.on('click', '[data-control="additem"]', function(e) {
            self.addItem(e);
        });
        // Toggle item completion.
        self.itemsList.on('click', '[data-control="toggle"]', function(e) {
            var id = $(e.currentTarget).closest('[data-item]').attr('data-item');
            self.toggleItem(id);
        });
        // Delete item.
        self.itemsList.on('click', '[data-control="delete"]', function(e) {
            var id = $(e.currentTarget).closest('[data-item]').attr('data-item');
            var text = $(e.currentTarget).closest('[data-item]').attr('data-text');
            self.deleteItem(e, id, text);
        });
        // Edit item.
        self.itemsList.on('click', '[data-control="edit"]', function(e) {
            var id = $(e.currentTarget).closest('[data-item]').attr('data-item');
            var text = $(e.currentTarget).closest('[data-item]').attr('data-text');
            var duedate = $(e.currentTarget).closest('[data-item]').attr('data-duedate');
            var groupid = $(e.currentTarget).closest('[data-item]').attr('data-groupid');
            self.editItem(e, id, text, duedate, groupid);
        });
        // Pin item.
        self.itemsList.on('click', '[data-control="pin"]', function(e) {
            var id = $(e.currentTarget).closest('[data-item]').attr('data-item');
            self.pinItem(id);
        });
        // Hide done items.
        self.main.on('click', '[data-control="hidedone"]', function() {
            var currentlyHidden = getHiddenState(self);
            if (typeof currentlyHidden !== 'undefined') {
                self.hideDoneItems(currentlyHidden);
            }
        });
        // Group items.
        self.main.on('click', '[data-control="group"]', function(e) {
            var groupid = $(e.currentTarget).find('[data-groupid]').attr('data-groupid');
            self.groupItems(groupid);
        });
        // Delete completed items.
        self.itemsList.on('click', '[data-control="deletedone"]', function(e) {
            self.deleteCompleted(e);
        });
    };

    /**
     * Are there hidden items?
     *
     * @param {jQuery} self
     * @returns {boolean}
     */
    const getHiddenState = (self) => {
        return Boolean(parseInt(self.currentHideDone.attr('data-hidedone')));
    };

    /**
     * What is the current group this page is displaying?
     *
     * @param {jQuery} self
     * @returns {number}
     */
    const getCurrentGroup = (self) => {
        return parseInt(self.currentGroup.attr('data-currentgroup'));
    };

    /**
     * Add a new item.
     *
     * @method
     * @param {Event} e The event
     * @return {Deferred}
     */
    TodoControl.prototype.addItem = async function(e) {
        var self = this;
        var trigger = $(e.currentTarget);
        var groups = await getGroupList();

        const args = {
            groups: groups,
        };

        // Create modal.
        ModalFactory.create({
            type: ModalFactory.types.SAVE_CANCEL,
            title: Str.getString('additem', 'block_todo'),
            body: Templates.render('block_todo/add', args),
        }, trigger)
        .done(function(modal) {

            modal.getRoot().on(ModalEvents.save, function(e) {
                var modalBody = modal.getBody();
                var text = $.trim(modalBody.find('.block_todo_add_text').val());
                var duedate = dateToTimestamp(modalBody.find('.block_todo_add_duedate').val());
                var groupid = parseInt(modalBody.find('input[name="block_todo_group"]:checked').val()) || 0;

                // Ensure there is a text value.
                if (!text) {
                    modalBody.find('.block_todo_add_text').focus();
                    e.preventDefault();
                    return false;
                }

                return Ajax.call([{
                    methodname: 'block_todo_add_item',
                    args: {
                        instanceid: instanceid,
                        todotext: text,
                        duedate: duedate,
                        groupid: groupid,
                        includehidden: !getHiddenState(self),
                        currentgroup: getCurrentGroup(self)
                    }

                }])[0].fail(function(reason) {
                    Log.error('block_todo/control: unable to add the item');
                    Log.debug(reason);
                    return $.Deferred().reject();

                }).then(function(response) {
                    self.itemsList.replaceWith(response);
                    init(instanceid);
                    return $.Deferred().resolve();
                });
            });

            // Handle hidden event.
            modal.getRoot().on(ModalEvents.hidden, function() {
                // Destroy when hidden.
                modal.destroy();
            });

            // Show the modal.
            modal.show();
        });
        return $.Deferred().resolve();
    };

    /**
     * Toggle the done status of the given item.
     *
     * @method
     * @param {number} id The item id
     * @return {Deferred}
     */
    TodoControl.prototype.toggleItem = function(id) {
        var self = this;

        if (!id) {
            Log.error('block_todo/control: no id provided');
            return $.Deferred().resolve();
        }

        return Ajax.call([{
            methodname: 'block_todo_toggle_item',
            args: {
                instanceid: instanceid,
                id: id,
                hide: getHiddenState(self),
                includehidden: !getHiddenState(self),
                currentgroup: getCurrentGroup(self)
            }

        }])[0].fail(function(reason) {
            Log.error('block_todo/control: unable to toggle the item');
            Log.debug(reason);
            return $.Deferred().reject();

        }).then(function(response) {
            self.itemsList.replaceWith(response);
            init(instanceid);
            return $.Deferred().resolve();
        });
    };

    /**
     * Edit the given item.
     *
     * @method
     * @param {Event} e The event
     * @param {number} id The item id
     * @param {string} text The text
     * @param {number} duedate The due date
     * @param {number} groupid The group id
     * @return {Deferred}
     */
    TodoControl.prototype.editItem = async function(e, id, text, duedate, groupid) {
        var self = this;
        var trigger = $(e.currentTarget);

        if (!id) {
            Log.error('block_todo/control: no id provided');
            return $.Deferred().resolve();
        }

        var groups = await getGroupList(groupid);

        const args = {
            id: id,
            text: text,
            duedate: null,
            groups: groups,
            includehidden: !getHiddenState(self),
            currentgroup: getCurrentGroup(self)
        };

        if (duedate) {
            args.duedate = timestampToDate(duedate);
        }

        // Create modal.
        ModalFactory.create({
            type: ModalFactory.types.SAVE_CANCEL,
            title: Str.getString('edititem', 'block_todo'),
            body: Templates.render('block_todo/edit', args),
        }, trigger)
        .done(function(modal) {

            modal.getRoot().on(ModalEvents.save, function(e) {

                var modalBody = modal.getBody();
                var newText = $.trim(modalBody.find('.block_todo_edit_text').val());
                var newDuedate = dateToTimestamp(modalBody.find('.block_todo_edit_duedate').val());
                var newGroupId = parseInt(modalBody.find('input[name="block_todo_group"]:checked').val()) || 0;

                // Ensure there is a text value.
                if (!newText) {
                    modalBody.find('.block_todo_edit_text').focus();
                    e.preventDefault();
                    return false;
                }

                return Ajax.call([{
                    methodname: 'block_todo_edit_item',
                    args: {
                        instanceid: instanceid,
                        id: id,
                        todotext: newText,
                        duedate: newDuedate,
                        groupid: newGroupId,
                        includehidden: !getHiddenState(self),
                        currentgroup: getCurrentGroup(self)
                    }

                }])[0].fail(function(reason) {
                    Log.error('block_todo/control: unable to edit the item');
                    Log.debug(reason);
                    return $.Deferred().reject();

                }).then(function(response) {
                    self.itemsList.replaceWith(response);
                    init(instanceid);
                    return $.Deferred().resolve();
                });
            });

            // Handle hidden event.
            modal.getRoot().on(ModalEvents.hidden, function() {
                // Destroy when hidden.
                modal.destroy();
            });

            // Show the modal.
            modal.show();
        });
        return $.Deferred().resolve();
    };

    /**
     * Delete the given item.
     *
     * @method
     * @param {Event} e The event
     * @param {number} id The item id
     * @param {string} text The text
     * @return {Deferred}
     */
    TodoControl.prototype.deleteItem = function(e, id, text) {
        var self = this;
        var trigger = $(e.currentTarget);

        if (!id) {
            Log.error('block_todo/control: no id provided');
            return $.Deferred().resolve();
        }

        // Create modal.
        ModalFactory.create({
            type: ModalFactory.types.SAVE_CANCEL,
            title: Str.getString('deleteitem', 'block_todo'),
            body: Str.getString('confirmdeletesingle', 'block_todo', text),
        }, trigger)
        .done(function(modal) {

            modal.setSaveButtonText('Confirm');
            modal.getRoot().on(ModalEvents.save, function() {

                return Ajax.call([{
                    methodname: 'block_todo_delete_item',
                    args: {
                        instanceid: instanceid,
                        id: id,
                        includehidden: !getHiddenState(self),
                        currentgroup: getCurrentGroup(self)
                    }

                }])[0].fail(function(reason) {
                    Log.error('block_todo/control: unable to delete the item');
                    Log.debug(reason);
                    return $.Deferred().reject();

                }).then(function(response) {
                    self.itemsList.replaceWith(response);
                    init(instanceid);
                    return $.Deferred().resolve();
                });
            });

            // Handle hidden event.
            modal.getRoot().on(ModalEvents.hidden, function() {
                // Destroy when hidden.
                modal.destroy();
            });

            // Show the modal.
            modal.show();
        });
        return $.Deferred().resolve();
    };

/**
     * Delete all completed items.
     *
     * @method
     * @param {Event} e The event
     * @return {Deferred}
     */
    TodoControl.prototype.deleteCompleted = function(e) {
        var self = this;
        var trigger = $(e.currentTarget);

        // Create modal.
        ModalFactory.create({
            type: ModalFactory.types.SAVE_CANCEL,
            title: Str.getString('deletecompleted', 'block_todo'),
            body: Str.getString('confirmdeletecompleted', 'block_todo'),
        }, trigger)
        .done(function(modal) {

            modal.setSaveButtonText('Confirm');
            modal.getRoot().on(ModalEvents.save, function() {

                return Ajax.call([{
                    methodname: 'block_todo_delete_completed',
                    args: {
                        instanceid: instanceid,
                        includehidden: !getHiddenState(self),
                        currentgroup: getCurrentGroup(self)
                    }

                }])[0].fail(function(reason) {
                    Log.error('block_todo/control: unable to delete completed items');
                    Log.debug(reason);
                    return $.Deferred().reject();

                }).then(function(response) {
                    self.itemsList.replaceWith(response);
                    init(instanceid);
                    return $.Deferred().resolve();
                });
            });

            // Handle hidden event.
            modal.getRoot().on(ModalEvents.hidden, function() {
                // Destroy when hidden.
                modal.destroy();
            });

            // Show the modal.
            modal.show();
        });
        return $.Deferred().resolve();
    };

    /**
     * Toggle the pin status of the given item.
     *
     * @method
     * @param {number} id The item id
     * @return {Deferred}
     */
    TodoControl.prototype.pinItem = function(id) {
        var self = this;

        if (!id) {
            Log.error('block_todo/control: no id provided');
            return $.Deferred().resolve();
        }

        return Ajax.call([{
            methodname: 'block_todo_pin_item',
            args: {
                instanceid: instanceid,
                id: id,
                includehidden: !getHiddenState(self),
                currentgroup: getCurrentGroup(self)
            }

        }])[0].fail(function(reason) {
            Log.error('block_todo/control: unable to pin the item');
            Log.debug(reason);
            return $.Deferred().reject();

        }).then(function(response) {
            self.itemsList.replaceWith(response);
            init(instanceid);
            return $.Deferred().resolve();
        });
    };

    /**
     * Toggle the hide status of the given items.
     *
     * @method
     * @param {boolean} hide To current hidden state (true means hidden).
     * @return {Deferred}
     */
    TodoControl.prototype.hideDoneItems = function(hide) {
        var self = this;

        // Invert the boolean to toggle the current hidden status.
        hide = !hide;

        return Ajax.call([{
            methodname: 'block_todo_hide_done_items',
            args: {
                instanceid: instanceid,
                hide: hide,
                includehidden: false,
                currentgroup: getCurrentGroup(self)
            }

        }])[0].fail(function(reason) {
            Log.error('block_todo/control: unable to hide/show the items');
            Log.debug(reason);
            return $.Deferred().reject();

        }).then(function(response) {
            self.itemsList.replaceWith(response);
            // Toggle the icon.
            if (getHiddenState(self)) {
                self.hideDoneButton.find('i').addClass('fa-eye-slash');
                self.hideDoneButton.find('i').removeClass('fa-eye');
            } else {
                self.hideDoneButton.find('i').addClass('fa-eye');
                self.hideDoneButton.find('i').removeClass('fa-eye-slash');
            }
            init(instanceid);
            return $.Deferred().resolve();
        });
    };

    /**
     * Group items together based on provided group id.
     *
     * @method
     * @param {number} groupid The group id to use.
     * @return {Deferred}
     */
    TodoControl.prototype.groupItems = function(groupid) {
        var self = this;

        return Ajax.call([{
            methodname: 'block_todo_group_items',
            args: {
                instanceid: instanceid,
                groupid: groupid,
                includehidden: !getHiddenState(self),
            }

        }])[0].fail(function(reason) {
            Log.error('block_todo/control: unable to group the items');
            Log.debug(reason);
            return $.Deferred().reject();

        }).then(function(response) {
            self.itemsList.replaceWith(response);
            init(instanceid);
            return $.Deferred().resolve();
        });
    };

    /**
     * Get group list.
     *
     * @param {number|null} selected groupid to use as the selection.
     * @returns {array}
     */
    const getGroupList = async(selected = null) => {
        return [
            {
                groupid: 0,
                groupname: await Str.getString('labelgroup0', 'block_todo'),
                groupicon: '',
                selected: selected == 0,
            },
            {
                groupid: 1,
                groupname: await Str.getString('labelgroup1', 'block_todo'),
                groupicon: 'fa-star',
                selected: selected == 1,
            },
            {
                groupid: 2,
                groupname: await Str.getString('labelgroup2', 'block_todo'),
                groupicon: 'fa-star',
                selected: selected == 2,
            },
            {
                groupid: 3,
                groupname: await Str.getString('labelgroup3', 'block_todo'),
                groupicon: 'fa-star',
                selected: selected == 3,
            },
            {
                groupid: 4,
                groupname: await Str.getString('labelgroup4', 'block_todo'),
                groupicon: 'fa-star',
                selected: selected == 4,
            },
            {
                groupid: 5,
                groupname: await Str.getString('labelgroup5', 'block_todo'),
                groupicon: 'fa-star',
                selected: selected == 5,
            },
        ];
    };

    /**
     * Take a date string and convert to timestamp
     *
     * @param {string} date date string
     * @return {number} 10 digit timestamp
     */
    function dateToTimestamp(date) {
        return Date.parse(date) / 1000;
    }

    /**
     * Take a 10 digit timestamp and convert to date string
     *
     * @param {number} timestamp 10 digit timestamp
     * @return {string} YYYY-MM-DD
     */
    function timestampToDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const datevalues = [
            date.getFullYear(),
            ("0" + (date.getMonth() + 1)).slice(-2),
            ("0" + date.getDate()).slice(-2),
        ];
        return datevalues.join('-');
    }

    return {
        init: init
    };
});
