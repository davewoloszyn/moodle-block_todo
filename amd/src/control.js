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
 * @category    output
 * @copyright   2018 David Mudrák <david@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
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

    /**
     * Initializes the block controls.
     *
     * @param {int} instanceid The instance id
     */
    function init(instanceid) {
        Log.debug('block_todo/control: initializing controls of the todo block instance ' + instanceid);

        var region = $('[data-region="block_todo-instance-' + instanceid +'"]').first();

        if (!region.length) {
            Log.error('block_todo/control: wrapping region not found!');
            return;
        }

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
    TodoControl.prototype.main = function () {
        var self = this;

        self.addForm = self.region.find('[data-control="addform"]').first();
        self.addTextInput = self.addForm.find('.block_todo_text');
        self.addDueDateInput = self.addForm.find('.block_todo_duedate');
        self.addSubmitButton = self.addForm.find('.block_todo_submit');
        self.itemsList = self.region.find('.list-wrapper');
        //self.itemsList = self.region.find('.list-group-item');

        self.initAddFeatures();
        self.initEditFeatures();
    };

    /**
     * Initialize the controls for adding a new todo item.
     *
     * @method
     */
    TodoControl.prototype.initAddFeatures = function () {
        var self = this;

        self.addForm.on('submit', function(e) {
            e.preventDefault();
            self.addNewTodo();
        });

        self.addSubmitButton.on('click', function() {
            self.addForm.submit();
        });
    };

    /**
     * Initialize the controls for modifying existing items.
     *
     * @method
     */
    TodoControl.prototype.initEditFeatures = function () {
        var self = this;

        // Toggle item completion.
        self.itemsList.on('click', '[data-control="toggle"]', function(e) {
            //e.preventDefault();
           //e.stopPropagation();
            var id = $(e.currentTarget).parent().attr('data-item');
            self.toggleItem(id);
        });
        // Delete item.
        self.itemsList.on('click', '[data-control="delete"]', function(e) {
            //e.preventDefault();
            //e.stopPropagation();
            var id = $(e.currentTarget).parent().attr('data-id');
            var text = $(e.currentTarget).parent().attr('data-text');
            self.deleteItem(e, id, text);
        });
        // Edit item.
        self.itemsList.on('click', '[data-control="edit"]', function(e) {
            //e.preventDefault();
            //e.stopPropagation();
            var id = $(e.currentTarget).parent().attr('data-id');
            var text = $(e.currentTarget).parent().attr('data-text');
            var duedate = $(e.currentTarget).parent().attr('data-duedate');
            self.editItem(e, id, text, duedate);
        });
    };

    /**
     * Add a new todo item.
     *
     * @method
     * @return {Deferred}
     */
    TodoControl.prototype.addNewTodo = function () {
        var self = this;
        var todotext = $.trim(self.addTextInput.val());
        var duedate = dateToTimestamp(self.addDueDateInput.val());

        if (!todotext) {
            return Str.get_string('placeholdermore', 'block_todo').then(function(text) {
                self.addTextInput.prop('placeholder', text);
                return $.Deferred().resolve();
            });
        }

        self.addTextInput.prop('disabled', true);

        return Ajax.call([{
            methodname: 'block_todo_add_item',
            args: {
                todotext: todotext,
                duedate: duedate,
            }

        }])[0].fail(function(reason) {
            Log.error('block_todo/control: unable to add the item');
            Log.debug(reason);
            self.addSubmitButton.addClass('btn-danger');
            self.addSubmitButton.html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>');
            return $.Deferred().reject();

        }).then(function(response) {
            return Templates.render('block_todo/item', response).fail(function(reason) {
                Log.error('block_todo/control: unable to render the new item:' + reason);
            });

        }).then(function(item) {
            self.itemsList.find('[data-duedategroup="' + duedate + '"]').prepend(item);
            self.addTextInput.val('');
            self.addTextInput.prop('disabled', false);
            self.addTextInput.focus();
            return $.Deferred().resolve();
        });
    };

    /**
     * Toggle the done status of the given item.
     *
     * @method
     * @param {int} id The item id
     * @return {Deferred}
     */
    TodoControl.prototype.toggleItem = function (id) {
        var self = this;

        if (!id) {
            return $.Deferred().resolve();
        }

        return Ajax.call([{
            methodname: 'block_todo_toggle_item',
            args: {
                id: id
            }

        }])[0].fail(function(reason) {
            Log.error('block_todo/control: unable to toggle the item');
            Log.debug(reason);
            return $.Deferred().reject();

        }).then(function(response) {
            return Templates.render('block_todo/item', response).fail(function(reason) {
                Log.error('block_todo/control: unable to render the new item:' + reason);
            });

        }).then(function(item) {
            self.itemsList.find('[data-item="' + id + '"]').replaceWith(item);
            return $.Deferred().resolve();
        });
    };

    /**
     * Edit the given item.
     *
     * @method
     * @param {Event} e The event
     * @param {id} id The event
     * @param {string} text The event
     * @param {int} duedate The event
     * @return {Deferred}
     */
    TodoControl.prototype.editItem = function (e, id, text, duedate) {

        var self = this;
        var trigger = $(e.currentTarget);

        const args = {
            id: id,
            text: text,
        };

        if (duedate) {
            args.duedate = timestampToDate(duedate);
        }

        // Create modal.
        ModalFactory.create({
            type: ModalFactory.types.SAVE_CANCEL,
            title: 'Edit item',
            body: Templates.render('block_todo/edit', args),
        }, trigger)
        .done(function(modal) {

            modal.getRoot().on(ModalEvents.save, function() {

                var modalBody = modal.getBody();
                var newtext = $.trim(modalBody.find('.block_todo_edit_text').val());
                var newduedate = dateToTimestamp(modalBody.find('.block_todo_edit_duedate').val());

                return Ajax.call([{
                    methodname: 'block_todo_edit_item',
                    args: {
                        id: id,
                        todotext: newtext,
                        duedate: newduedate,
                    }

                }])[0].fail(function(reason) {
                    Log.error('block_todo/control: unable to edit the item');
                    Log.debug(reason);
                    return $.Deferred().reject();

                }).then(function(response) {

                    return Templates.render('block_todo/item', response).fail(function(reason) {
                        Log.error('block_todo/control: unable to render the new item:' + reason);
                    });

                }).then(function(item) {
                    self.itemsList.find('[data-item="' + id + '"]').replaceWith(item);
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
    };

    /**
     * Delete the given item.
     *
     * @method
     * @param {Event} e The event
     * @param {int} id The item id
     * @param {string} text The event
     * @return {Deferred}
     */
    TodoControl.prototype.deleteItem = function(e, id, text) {
        var self = this;
        var trigger = $(e.currentTarget);

        if (!id) {
            return $.Deferred().resolve();
        }

        // Create modal.
        ModalFactory.create({
            type: ModalFactory.types.SAVE_CANCEL,
            title: 'Delete item',
            body: 'Are you sure you want to delete <strong>' + text + '</strong>?',
        }, trigger)
        .done(function(modal) {

            modal.setSaveButtonText('Confirm');
            modal.getRoot().on(ModalEvents.save, function() {

                return Ajax.call([{
                    methodname: 'block_todo_delete_item',
                    args: {
                        id: id
                    }

                }])[0].fail(function(reason) {
                    Log.error('block_todo/control: unable to delete the item');
                    Log.debug(reason);
                    return $.Deferred().reject();

                }).then(function(deletedid) {
                    self.itemsList.find('[data-item="' + deletedid + '"]').remove();
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
    };

    /**
     * Take a date string and convert to timestamp
     *
     * @param {string} date date string
     * @return {int} 10 digit timestamp
     */
        function dateToTimestamp(date) {
            return Date.parse(date) / 1000;
    }

    /**
     * Take a 10 digit timestamp and convert to date string
     *
     * @param {int} timestamp 10 digit timestamp
     * @return {string} YYYY-MM-DD
     */
        function timestampToDate(timestamp) {

            const date = new Date(timestamp * 1000);
            const datevalues = [
                date.getFullYear(),
                ("0" + date.getMonth()+1).slice(-2),
                ("0" + date.getDate()).slice(-2),
            ];

        return datevalues[0] + '-' + datevalues[1] + '-' + datevalues[2];
    }

    return {
        init: init
    };
});
