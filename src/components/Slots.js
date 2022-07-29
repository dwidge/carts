import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { uuid, replaceItemById, dropItemById } from '@dwidge/lib'
import { onChange } from '@dwidge/lib-react'
import './Slots.css'

const Slots = ({ stslots }) => {
	const [slots, setslots] = stslots
	const [idEdit, setidEdit] = useState()
	const [confirm, setconfirm] = useState(false)

	const setslot = slot => setslots(replaceItemById(slots, slot))
	const delslot = id =>
		setslots(dropItemById(slots, id))
	const addslot = slot => setslots(slots.concat([slot]))
	const newslot = () => ({ id: uuid(), day: 1, beg: 6, end: 8 })

	const onClear = () => {
		confirm && setslots([])
		setconfirm(!confirm)
	}

	return (
		<div-page>
			<slot-table data-testid="slotTable">
				<slot-header>
					<slot-day>Day</slot-day>
					<slot-beg>Beg</slot-beg>
					<slot-end>End</slot-end>
				</slot-header>
				{slots.map(slot => idEdit === slot.id ? (<SlotEdit key={slot.id} slot={slot} onSave={slot => { setslot(slot); setidEdit() }} onCancel={setidEdit} />) : (<SlotRow key={slot.id} slot={slot} onEdit={setidEdit} onDel={delslot} />))}
			</slot-table>
			<button onClick={() => addslot(newslot())} data-testid="buttonAdd">Add</button>
			<button onClick={onClear} data-testid="buttonClear">{confirm ? 'Confirm' : 'Clear'}</button>
		</div-page>
	)
}

Slots.propTypes = {
	stslots: PropTypes.array.isRequired,
}

const SlotRow = ({ slot, onEdit, onDel }) => {
	const { id, day, beg, end } = slot

	return (
		<slot-item>
			<slot-day>{day}</slot-day>
			<slot-beg>{beg}</slot-beg>
			<slot-end>{end}</slot-end>
			<slot-buttons>
				<button onClick={() => onEdit(id)} data-testid={'buttonEdit' + id}>Edit</button>
				<button onClick={() => onDel(id)} data-testid={'buttonDel' + id}>Del</button>
			</slot-buttons>
		</slot-item>
	)
}

SlotRow.propTypes = {
	slot: PropTypes.object.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDel: PropTypes.func.isRequired,
}

const SlotEdit = ({ slot, onSave, onCancel }) => {
	const { id } = slot
	const [day, setday] = useState(slot.day)
	const [beg, setbeg] = useState(slot.beg)
	const [end, setend] = useState(slot.end)

	return (
		<slot-item>
			<slot-day><input data-testid="inputDay" value={day} onChange={onChange(setday)} /></slot-day>
			<slot-beg><input data-testid="inputBeg" value={beg} onChange={onChange(setbeg)} /></slot-beg>
			<slot-end><input data-testid="inputEnd" value={end} onChange={onChange(setend)} /></slot-end>
			<slot-buttons>
				<button onClick={() => onSave({ id, day, beg, end })} data-testid="buttonSave">Save</button>
				<button onClick={onCancel} data-testid="buttonCancel">Cancel</button>
			</slot-buttons>
		</slot-item>
	)
}
SlotEdit.propTypes = {
	slot: PropTypes.object.isRequired,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
}

export default Slots
