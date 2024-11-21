/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
export function isDialogOpened() {
	// Select all elements with role="dialog"
	const dialogs = document.querySelectorAll('[role="dialog"]')

	// Check if any dialog is visible
	return Array.from(dialogs).some(dialog => {
		const style = window.getComputedStyle(dialog)
		return style.display !== 'none' && style.visibility !== 'hidden'
	})
}
