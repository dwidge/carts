import React from 'react'
import PropTypes from 'prop-types'
import { calcCsvFromObjects } from '@dwidge/lib'
import { ImportFile, saveText } from '@dwidge/table-react'

const Data = ({ stslots, stcarts, stpubs }) => {
	const [slots, setslots] = stslots
	const [carts, setcarts] = stcarts
	const [pubs, setpubs] = stpubs

	const isClear = () =>
		!slots.length && !carts.length && !pubs.length

	const clearAll = () => {
		setslots([])
		setcarts([])
		setpubs([])
	}
	const importJSON = (text) => {
		try {
			const data = JSON.parse(text)
			if (isClear() || confirm('Existing data will be replaced.')) {
				setslots(data.slots)
				setcarts(data.carts)
				setpubs(data.pubs)
			}
		} catch (e) {
			alert('Not valid JSON.')
		}
	}
	const exportCSV = () => {
		saveText(calcCsvFromObjects(slots), 'slots.csv')
		saveText(calcCsvFromObjects(carts), 'carts.csv')
		saveText(calcCsvFromObjects(pubs), 'pubs.csv')
	}
	const exportJSON = () => {
		saveText(JSON.stringify({ slots, carts, pubs }, null, 2), 'carts.json')
	}

	return (
		<div-page data-testid="pageData">
			<p>Slots: {slots.length}</p>
			<p>Carts: {carts.length}</p>
			<p>Pubs: {pubs.length}</p>
			<button onClick={clearAll}>Clear All</button>
			<div>
				<ImportFile ext='.json' onAccept={importJSON}/>
				<button onClick={exportJSON}>Export .json</button>
				<button onClick={exportCSV}>Export .csv</button>
			</div>
			<p>Import/export .json to backup or transfer between devices. Export .csv to use with a spreadsheet program.</p>
		</div-page>
	)
}

Data.propTypes = {
	stslots: PropTypes.array.isRequired,
	stcarts: PropTypes.array.isRequired,
	stpubs: PropTypes.array.isRequired,
}

export default Data
