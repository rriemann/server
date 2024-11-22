/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ActiveStore } from '../types.ts'
import type { Node } from '@nextcloud/files'

import { defineStore } from 'pinia'
import { subscribe } from '@nextcloud/event-bus'
import logger from '../logger.ts'

export const useActiveStore = function(...args) {
	const store = defineStore('active', {
		state: () => ({
			active: null,
		} as ActiveStore),

		actions: {
			setActiveNode(node: Node) {
				if (!node) {
					throw new Error('Use clearActiveNode to clear the active node')
				}
				logger.debug('Setting active node', { node })
				this.active = node
			},

			/**
			 * Clear the active node
			 */
			clearActiveNode() {
				this.active = null
			},

			onDeletedNode(node: Node) {
				if (this.active && this.active.source === node.source) {
					this.clearActiveNode()
				}
			},
		},
	})

	const activeStore = store(...args)

	// Make sure we only register the listeners once
	if (!activeStore._initialized) {
		subscribe('files:node:deleted', activeStore.onDeletedNode)
		subscribe('files:navigation:changed', activeStore.clearActiveNode)

		activeStore._initialized = true
	}

	return activeStore
}
