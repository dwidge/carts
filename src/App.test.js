import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as J from '@dwidge/lib-react'
import { getTag, getTags, getText } from '@dwidge/lib-react'
import * as Lib from '@dwidge/lib'

import Slots from './components/Slots'
import Carts from './components/Carts'

import {
	MemoryRouter,
} from 'react-router-dom'
import App from './App'

const text = J.tools(userEvent, screen, jest).text
const type = J.type(userEvent, screen)
const input = J.input(userEvent, screen)
const click = J.click(userEvent, screen)
const serialSpy = J.serialSpy(jest)

jest.mock('@dwidge/lib', () => {
	return {
		__esModule: true,
		...jest.requireActual('@dwidge/lib'),
	}
})
beforeEach(async () => {
	serialSpy(Lib, 'uuid', [1, 2, 3])
})
afterEach(() => {
	jest.restoreAllMocks()
})

const getSlotList = () =>
	getTags(screen.getByTestId('slotTable'))('slot-item').map(slotItem => ['slot-day', 'slot-beg', 'slot-end'].map(getTag(slotItem)).map(getText))

const getCartList = () =>
	getTags(screen.getByTestId('cartTable'))('cart-item').map(item => [getText(getTag(item)('cart-name')), getTags(getTag(item)('cart-slots'))('div').map(getText)])

describe('Slots', () => {
	const slot1 = { id: 1, day: 1, beg: 6, end: 8 }
	const slot2 = { id: 2, day: 2, beg: 14, end: 17 }

	it('enters day,beg,end into list', async () => {
		const App = () => (<Slots stslots={useState([])}/>)
		render(<App/>)
		click('buttonAdd')
		click('buttonEdit1')
		await input('inputDay', '1')
		await input('inputBeg', '6')
		await input('inputEnd', '8')
		click('buttonSave')
		expect(getSlotList()).toEqual([['1', '6', '8']])
	})

	it('enters another day,beg,end into list', async () => {
		const App = () => (<Slots stslots={useState([slot1])}/>)
		render(<App/>)
		expect(getSlotList()).toEqual([['1', '6', '8']])
		Lib.uuid()
		click('buttonAdd')
		click('buttonEdit2')
		await input('inputDay', '2')
		await input('inputBeg', '14')
		await input('inputEnd', '17')
		click('buttonSave')
		expect(getSlotList()).toEqual([['1', '6', '8'], ['2', '14', '17']])
	})

	it('confirms & clears list', async () => {
		const App = () => (<Slots stslots={useState([slot1, slot2])}/>)
		render(<App/>)
		expect(getSlotList()).toEqual([['1', '6', '8'], ['2', '14', '17']])
		expect(text('buttonClear')).toEqual('Clear')
		click('buttonClear')
		expect(text('buttonClear')).toEqual('Confirm')
		expect(getSlotList()).toEqual([['1', '6', '8'], ['2', '14', '17']])
		click('buttonClear')
		expect(text('buttonClear')).toEqual('Clear')
		expect(getSlotList()).toEqual([])
	})
})

describe('Carts', () => {
	const slot1 = { id: 1, day: 1, beg: 6, end: 8 }
	const cart1 = { id: 1, name: 'cart1', slots: [1] }
	const cart2 = { id: 2, name: 'cart2', slots: [] }

	it('enters cart into list', async () => {
		const App = () => (<Carts stslots={useState([])} stcarts={useState([])} />)
		render(<App/>)
		click('buttonAdd')
		click('buttonEdit1')
		await type('inputName', '1')
		click('buttonSave')
		expect(getCartList()).toEqual([['cart1', []]])
	})

	it('enables a slot', async () => {
		const App = () => (<Carts stslots={useState([slot1])} stcarts={useState([])} />)
		render(<App/>)
		click('buttonAdd')
		click('buttonEdit1')
		await type('inputName', '1')
		click('inputSlots1')
		click('buttonSave')
		expect(getCartList()).toEqual([['cart1', ['1 6-8']]])
	})

	it('clears missing slot', async () => {
		const App = () => (<Carts stslots={useState([])} stcarts={useState([cart1])} />)
		render(<App/>)
		expect(getCartList()).toEqual([['cart1', []]])
	})

	it('confirms & clears list', async () => {
		const App = () => (<Carts stslots={useState([slot1])} stcarts={useState([cart1, cart2])} />)
		render(<App/>)
		expect(getCartList()).toEqual([['cart1', ['1 6-8']], ['cart2', []]])
		expect(text('buttonClear')).toEqual('Clear')
		click('buttonClear')
		expect(text('buttonClear')).toEqual('Confirm')
		expect(getCartList()).toEqual([['cart1', ['1 6-8']], ['cart2', []]])
		click('buttonClear')
		expect(text('buttonClear')).toEqual('Clear')
		expect(getCartList()).toEqual([])
	})
})

test('renders buttons', () => {
	render(<MemoryRouter initialEntries={['/carts']}>
		<App />
	</MemoryRouter>)

	expect(screen.getByText(/Add/i)).toBeInTheDocument()
	expect(screen.getByText(/Clear/i)).toBeInTheDocument()
})
describe('pubs', () => {
	test('renders buttons', () => {
		render(<MemoryRouter initialEntries={['/pubs']}>
			<App />
		</MemoryRouter>)

		expect(screen.getByText(/Add/i)).toBeInTheDocument()
		expect(screen.getByText(/Clear/i)).toBeInTheDocument()
	})
})
