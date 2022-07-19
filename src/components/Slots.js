import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { uuid } from '@dwidge/lib/random'
import { onChange } from '@dwidge/lib-react/helpers'

const Slots = ({ stslots }) => {
	const [slots, setslots] = stslots
	const [day, setday] = useState('')
	const [beg, setbeg] = useState('')
	const [end, setend] = useState('')
	const onAdd = () => {
		const slot = { id: uuid(), day, beg, end }

		setslots(slots.concat([slot]))
		setday('')
		setbeg('')
		setend('')
	}

	return (
		<div>
			<input value={day} onChange={onChange(setday)} data-testid="inputDay"></input>
			<input value={beg} onChange={onChange(setbeg)} data-testid="inputBeg"></input>
			<input value={end} onChange={onChange(setend)} data-testid="inputEnd"></input>
			<button onClick={onAdd} data-testid="buttonAdd">Add</button>

			<div data-testid="slotList">
				<slot-header>
					<slot-day>day</slot-day>
					<slot-beg>beg</slot-beg>
					<slot-end>end</slot-end>
				</slot-header>
				{slots.map(({ id, day, beg, end }) => (
					<slot-item key={id}>
						<slot-day>{day}</slot-day>
						<slot-beg>{beg}</slot-beg>
						<slot-end>{end}</slot-end>
					</slot-item>
				))}</div>
		</div>
	)
}

Slots.propTypes = {
	stslots: PropTypes.array.isRequired,
}

export default Slots
