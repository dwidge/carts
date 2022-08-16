import React from 'react'
import PropTypes from 'prop-types'
import { getItemById, calcCsvFromObjects, mapObject } from '@dwidge/lib'
import { ExportFile } from '@dwidge/table-react'

const slottoString = slot =>
	slot ? slot.day + ' ' + slot.beg + '-' + slot.end : '-'
const slottoInt = slot =>
	(+slot.day || 0) * 24 + (+slot.beg || 0)
const slotsAsc = (a, b) => (slottoInt(a.slot) - slottoInt(b.slot))
const pubAllowsCart = cartid => pub =>
	pub.carts.includes(cartid)
const pubAllowsSlot = slotid => pub =>
	pub.slots.includes(slotid)
const sum = (total, x) => total + x

const Schedule = ({ slots, carts, pubs }) => {
	try {
		const csPubsAsc = (a, b) => a.pubs.length - b.pubs.length
		const csNoPubs = (a) => !a.pubs.length
		const csSomePubs = (a) => a.pubs.length
		const findAvailablePubs = (pubs, cartid, slotid) =>
			pubs.filter(a => pubAllowsCart(cartid)(a)).filter(a => pubAllowsSlot(slotid)(a))
		const findAvailableSlots = (cartslots, pub) => cartslots.filter(({ cart, slot }) => pubAllowsCart(cart.id)(pub) && pubAllowsSlot(slot.id)(pub))
		const pubAvailableSlotsAsc = cartslots => (a, b) => findAvailableSlots(cartslots, a) - findAvailableSlots(cartslots, b)
		const pubAssignments = cartslots => pub =>
			cartslots.filter(cs => cs.pub === pub)
		const pubHours = cartslots => pub =>
			pubAssignments(cartslots)(pub).map(cs => cs.slot.end - cs.slot.beg).reduce(sum, 0)
		const pubAssignmentsAsc = cartslots => (a, b) =>
			pubAssignments(cartslots)(a).length - pubAssignments(cartslots)(b).length

		const cartslotspubs = carts.map(cart => cart.slots.map(slotid => ({
			key: cart.id + '-' + slotid,
			cart,
			slot: getItemById(slots, slotid),
			pubs: findAvailablePubs(pubs, cart.id, slotid),
		}))).flat().sort(csPubsAsc)

		const assigned = cartslotspubs.filter(csNoPubs); let unassigned = cartslotspubs.filter(csSomePubs)
		while (unassigned.length) {
			const [first, ...rest] = unassigned
			const pubs = first.pubs.sort((a, b) => pubAvailableSlotsAsc(unassigned)(a, b) || pubAssignmentsAsc(assigned)(a, b))
			first.pub = pubs[0]
			assigned.push(first)
			unassigned = rest
		}
		const pubsUsed = pubs.map((pub) => [pub, pubAssignments(assigned)(pub).length, pubHours(assigned)(pub)])
		const sched = assigned.sort(slotsAsc).map(o => ({
			key: o.key,
			cart: o.cart.name,
			slot: slottoString(o.slot),
			pub: o.pub?.name || '-',
		}))
		const totals = pubsUsed.map(o => ({
			key: o[0].name,
			pub: o[0].name,
			slots: o[1],
			hours: o[2],
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
							<cart-name>{o.cart}</cart-name>
							<cart-slots>{o.slot}</cart-slots>
							<cart-pub>{o.pub}</cart-pub>
						</cart-item>
					))}
				</cart-table>
				<ExportFile ext='.csv' name='schedule.csv' content={calcCsvFromObjects(sched.map(mapObject(['cart', 'slot', 'pub'])))}/>
				<cart-table data-testid="tableStats">
					<cart-header>
						<cart-name>Pub</cart-name>
						<cart-name>Slots</cart-name>
						<cart-name>Hours</cart-name>
					</cart-header>
					{totals.map(o => (
						<cart-item key={o.key}>
							<cart-name>{o.pub}</cart-name>
							<cart-name>{o.slots}</cart-name>
							<cart-name>{o.hours}</cart-name>
						</cart-item>
					))}
				</cart-table>
				<ExportFile ext='.csv' name='totals.csv' content={calcCsvFromObjects(totals.map(mapObject(['pub', 'slots', 'hours'])))}/>
				<p>Each time slot of each cart is assigned a person. The person with the least slots so far is chosen for the next slot with the least available persons. The list is sorted by time slot.</p>
			</div-page>
		)
	} catch (e) {
		return (<div>Missing slots, carts, or pubs.</div>)
	}
}

Schedule.propTypes = {
	slots: PropTypes.array.isRequired,
	carts: PropTypes.array.isRequired,
	pubs: PropTypes.array.isRequired,
}

export default Schedule
