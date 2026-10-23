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
 * A due date, with "Today" and "Overdue" badges where relevant.
 *
 * @module     block_todo/DueDate
 * @copyright  2026 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useState} from 'react';
import {Badge} from '@moodlehq/design-system';
import {getStrings} from '@moodle/lms/core/stringUtils';

interface DueDateProps {
    duedate: number;
}

function DueDate({duedate}: DueDateProps) {
    const due = new Date(duedate * 1000);
    // Format in the page's language (Moodle sets <html lang>), e.g. "Wed, 21 Oct" in English.
    const locale = document.documentElement.lang || undefined;
    const formatted = due.toLocaleDateString(locale, {weekday: 'short', day: 'numeric', month: 'short'});
    const today = due.toDateString() === new Date().toDateString();
    const overdue = duedate <= (Date.now() / 1000) - 86400;

    // Badge's label must be a plain string, so fetch the translated text up front.
    const [todayLabel, setTodayLabel] = useState('');
    const [overdueLabel, setOverdueLabel] = useState('');

    useEffect(() => {
        getStrings([
            {key: 'today', component: 'block_todo'},
            {key: 'overdue', component: 'block_todo'},
        ]).then(([todaystring, overduestring]) => {
            setTodayLabel(todaystring);
            setOverdueLabel(overduestring);
            return;
        });
    }, []);

    return (
        <>
            {formatted}
            <span className="ms-1">
                {today && (
                    <Badge
                        label={todayLabel}
                        pill
                        subtle={false}
                        variant="success"
                    />
                )}
                {overdue && (
                    <Badge
                        label={overdueLabel}
                        pill
                        subtle={false}
                        variant="danger"
                    />
                )}
            </span>
        </>
    );
}

export default DueDate;
