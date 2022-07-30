import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnSet } from '@dwidge/table-react'

const slottoString = o =>
	o.day + ' ' + o.beg + '-' + o.end

const carttoString = o =>
	o.name

const Pubs = ({ slots, carts, stpubs }) =>
	(<>
		<Table name='Pubs' schema={{
			name: ColumnText('Name'),
			slots: ColumnSet('Slots', slots, slottoString),
			carts: ColumnSet('Carts', carts, carttoString),
		}} defaults={{ name: 'pub', slots: [], carts: [] }} rows={stpubs} />
		<p>Name is any text or address to help you identify the person.</p>
		<p>Slots are the preferred time slots for the person which you pick from the Slots page.</p>
		<p>Carts are the preferred places for the person which you pick from the Carts page.</p>
		<p>Examples</p>
		<p>Name: Person A, Slots: 1 6-8, 7 14-16, Carts: Cart A, Cart C</p>
		<p>Name: John, Slots: Sunday2 14-16, Carts: Waterfall Rd</p>
	</>)

Pubs.propTypes = {
	slots: PropTypes.array.isRequired,
	carts: PropTypes.array.isRequired,
	stpubs: PropTypes.array.isRequired,
}

export default Pubs
