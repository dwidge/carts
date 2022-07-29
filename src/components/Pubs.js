import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnSet } from '@dwidge/table-react'

const slottoString = o =>
	o.day + ' ' + o.beg + '-' + o.end

const carttoString = o =>
	o.name

const Pubs = ({ slots, carts, stpubs }) =>
	(<Table name='Pubs' schema={{
		name: ColumnText('Name'),
		slots: ColumnSet('Slots', slots, slottoString),
		carts: ColumnSet('Carts', carts, carttoString),
	}} defaults={{ name: 'pub', slots: [], carts: [] }} rows={stpubs} />)

Pubs.propTypes = {
	slots: PropTypes.array.isRequired,
	carts: PropTypes.array.isRequired,
	stpubs: PropTypes.array.isRequired,
}

export default Pubs
