import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { getItemById } from '@dwidge/lib'

const slottoString = slot =>
	slot ? slot.day + ' ' + slot.beg + '-' + slot.end : '-'
const slottoInt = slot =>
	slot.day * 24 + slot.beg
const slotsAsc = (a, b) => slottoInt(a) - slottoInt(b)
const pubAllowsCart = cartid => pub =>
	pub.carts.includes(cartid)
const pubAllowsSlot = slotid => pub =>
	pub.slots.includes(slotid)

const Schedule = ({ slots, carts, pubs }) => {
	const cartslots = carts.map(cart => cart.slots.map(slot => [cart, getItemById(slots, slot)])).flat().sort(slotsAsc)
	const pubsUsed = pubs.map((pub, i) => [pub, 0, 0])

	const [arrangeBy] = useState(1)
	const usedCountAsc = (a, b) => a[arrangeBy] - b[arrangeBy]
	const findAvailablePub = ([cart, slot]) =>
		pubsUsed.filter(a => pubAllowsCart(cart.id)(a[0])).filter(a => pubAllowsSlot(slot.id)(a[0])).sort(usedCountAsc)[0]
	const incPub = (pubUsed, slot) => {
		pubUsed[1]++
		pubUsed[2] += slot.end - slot.beg
	}
	const incPubAndGet = (pubUsed, slot) =>
		pubUsed ? (incPub(pubUsed, slot), pubUsed[0]) : undefined

	const sched = cartslots.map(([cart, slot]) => ({
		key: cart.name + '-' + slot.id,
		cart,
		slot,
		pub: incPubAndGet(findAvailablePub([cart, slot]), slot),
	}))

	return (
		<div-page>
			<cart-table data-testid="tableSchedule">
				<cart-header>
					<cart-name>Cart</cart-name>
					<cart-slots>Slot</cart-slots>
					<cart-pub>Pub</cart-pub>
				</cart-header>
				{sched.map(o => (
					<cart-item key={o.key}>
						<cart-name>{o.cart.name}</cart-name>
						<cart-slots>{slottoString(o.slot)}</cart-slots>
						<cart-pub>{o.pub?.name || '-'}</cart-pub>
					</cart-item>
				))}
			</cart-table>
			<cart-table data-testid="tableStats">
				<cart-header>
					<cart-name>Pub</cart-name>
					<cart-name>Slots</cart-name>
					<cart-name>Hours</cart-name>
				</cart-header>
				{pubsUsed.map(o => (
					<cart-item key={o[0].name}>
						<cart-name>{o[0].name}</cart-name>
						<cart-name>{o[1]}</cart-name>
						<cart-name>{o[2]}</cart-name>
					</cart-item>
				))}
			</cart-table>
		</div-page>
	)
}

Schedule.propTypes = {
	slots: PropTypes.array.isRequired,
	carts: PropTypes.array.isRequired,
	pubs: PropTypes.array.isRequired,
}

export default Schedule
