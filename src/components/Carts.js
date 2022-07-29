import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { uuid, getItemById, replaceItemById, dropItemById } from '@dwidge/lib'
import { onChange, onChangeChecks } from '@dwidge/lib-react'

const Carts = ({ stslots, stcarts }) => {
	const [allslots] = stslots
	const [rawcarts, setcarts] = stcarts
	const [idEdit, setidEdit] = useState()
	const [confirm, setconfirm] = useState(false)

	const dropMissingSlots = cart => ({ ...cart, slots: cart.slots.filter(id => getItemById(allslots, id)) })
	const carts = rawcarts.map(dropMissingSlots)

	const setcart = cart => setcarts(replaceItemById(carts, cart))
	const delcart = id =>
		setcarts(dropItemById(carts, id))
	const addcart = cart => setcarts(carts.concat([cart]))
	const newcart = () => ({ id: uuid(), name: 'cart', slots: [] })

	const onClear = () => {
		confirm && setcarts([])
		setconfirm(!confirm)
	}

	return (
		<div-page>
			<cart-table data-testid="cartTable">
				<cart-header>
					<cart-name>Name</cart-name>
					<cart-slots>Slots</cart-slots>
				</cart-header>
				{carts.map(cart => idEdit === cart.id ? (<CartEdit key={cart.id} allslots={allslots} cart={cart} onSave={cart => { setcart(cart); setidEdit() }} onCancel={setidEdit} />) : (<CartRow key={cart.id} allslots={allslots} cart={cart} onEdit={setidEdit} onDel={delcart} />))}
			</cart-table>
			<button onClick={() => addcart(newcart())} data-testid="buttonAdd">Add</button>
			<button onClick={onClear} data-testid="buttonClear">{confirm ? 'Confirm' : 'Clear'}</button>
		</div-page>
	)
}

Carts.propTypes = {
	stslots: PropTypes.array.isRequired,
	stcarts: PropTypes.array.isRequired,
}

const CartRow = ({ allslots, cart, onEdit, onDel }) => {
	const { id, name, slots } = cart

	return (
		<cart-item>
			<cart-name>{name}</cart-name>
			<cart-slots>{slots.map(id => getItemById(allslots, id)).map(({ id, day, beg, end }) =>
				(<div key={id}>{day} {beg}-{end}</div>),
			)}</cart-slots>
			<cart-buttons>
				<button onClick={() => onEdit(id)} data-testid={'buttonEdit' + id}>Edit</button>
				<button onClick={() => onDel(id)} data-testid={'buttonDel' + id}>Del</button>
			</cart-buttons>
		</cart-item>
	)
}

CartRow.propTypes = {
	allslots: PropTypes.array.isRequired,
	cart: PropTypes.object.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDel: PropTypes.func.isRequired,
}

const CartEdit = ({ allslots, cart, onSave, onCancel }) => {
	const { id } = cart
	const [name, setname] = useState(cart.name)
	const [slots, setslots] = useState(cart.slots)

	return (
		<cart-item>
			<cart-name><input data-testid="inputName" value={name} onChange={onChange(setname)} /></cart-name>
			<cart-slots>{allslots.map(({ id, day, beg, end }) =>
				(<div key={id}><input data-testid={'inputSlots' + id} type="checkbox" checked={slots.includes(id)} onChange={onChangeChecks(id, slots, setslots)} /> {day} {beg}-{end}</div>),
			)}</cart-slots>
			<cart-buttons>
				<button onClick={() => onSave({ id, name, slots })} data-testid="buttonSave">Save</button>
				<button onClick={onCancel} data-testid="buttonCancel">Cancel</button>
			</cart-buttons>
		</cart-item>
	)
}

CartEdit.propTypes = {
	allslots: PropTypes.array.isRequired,
	cart: PropTypes.object.isRequired,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
}

export default Carts
