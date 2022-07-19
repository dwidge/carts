import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { uuid } from '@dwidge/lib/random'
import { onChange, onChangeChecks } from '@dwidge/lib-react/helpers'
import { replaceItemById, dropItemById } from '@dwidge/lib/array'

const Carts = ({ stslots, stcarts }) => {
	const [allslots] = stslots
	const [carts, setcarts] = stcarts
	const [idEdit, setidEdit] = useState()

	const setcart = cart => setcarts(replaceItemById(carts, cart))
	const delcart = id =>
		setcarts(dropItemById(carts, id))
	const addcart = cart => setcarts(carts.concat([cart]))
	const newcart = () => ({ id: uuid(), name: 'cart', slots: [] })

	return (
		<div>
			<cart-header>
				<cart-name>name</cart-name>
				<cart-slots>slots</cart-slots>
			</cart-header>
			<cart-table data-testid="cartTable">
				{carts.map(cart => idEdit === cart.id ? (<CartEdit key={cart.id} allslots={allslots} cart={cart} onSave={cart => { setcart(cart); setidEdit() }} onCancel={setidEdit} />) : (<CartRow key={cart.id} allslots={allslots} cart={cart} onEdit={setidEdit} onDel={delcart} />))}
			</cart-table>
			<button onClick={() => addcart(newcart())} data-testid="buttonAdd">Add</button>
		</div>
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
			<cart-slots>{allslots.map(({ id }) =>
				(<input key={id} id={id} type="checkbox" value={slots.includes(id)} />),
			)}</cart-slots>
			<button onClick={() => onEdit(id)} data-testid={'buttonEdit' + id}>Edit</button>
			<button onClick={() => onDel(id)} data-testid={'buttonDel' + id}>Del</button>
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
	const [slots, setslots] = useState([])

	return (
		<cart-item>
			<cart-name><input data-testid="inputName" value={name} onChange={onChange(setname)} /></cart-name>
			<cart-slots>{allslots.map(({ id }) =>
				(<input key={id} data-testid={'inputSlots' + id} type="checkbox" value={slots.includes(id)} onChange={onChangeChecks(id, slots, setslots)} />),
			)}</cart-slots>
			<button onClick={() => onSave({ id, name, slots })} data-testid="buttonSave">Save</button>
			<button onClick={onCancel} data-testid="buttonCancel">Cancel</button>
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
