import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Slots from './components/Slots'
import Carts from './components/Carts'
import * as Random from '@dwidge/lib/random'
import * as J from '@dwidge/lib-react/jest'
import { getTag, getTags, getText } from '@dwidge/lib-react/jest'

const type = J.type(userEvent, screen)
const click = J.click(userEvent, screen)
const serialSpy = J.serialSpy(jest)

const getSlotList = () =>
	getTags(screen.getByTestId('slotList'))('slot-item').map(slotItem => ['slot-day', 'slot-beg', 'slot-end'].map(getTag(slotItem)).map(getText))

const getCartList = () =>
	getTags(screen.getByTestId('cartTable'))('cart-item').map(item => [getText(getTag(item)('cart-name')), getTags(getTag(item)('cart-slots'))('input').filter(el => el.value === 'true').map(item => item.id)])

beforeEach(async () => {
	serialSpy(Random, 'uuid', [1, 2, 3])
})
afterEach(() => {
	jest.restoreAllMocks()
})

describe('Slots', () => {
	it('enters day,beg,end into list', async () => {
		const App = () => (<Slots stslots={useState([])}/>)
		render(<App/>)
		await type('inputDay', '1')
		await type('inputBeg', '6')
		await type('inputEnd', '8')
		click('buttonAdd')
		expect(getSlotList()).toEqual([['1', '6', '8']])
	})

	it('enters another day,beg,end into list', async () => {
		const App = () => (<Slots stslots={useState([{ id: 4, day: 1, beg: 6, end: 8 }])}/>)
		render(<App/>)
		expect(getSlotList()).toEqual([['1', '6', '8']])
		await type('inputDay', '2')
		await type('inputBeg', '14')
		await type('inputEnd', '17')
		click('buttonAdd')
		expect(getSlotList()).toEqual([['1', '6', '8'], ['2', '14', '17']])
	})
})

describe('Carts', () => {
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
		const App = () => (<Carts stslots={useState([{ id: 4, day: 1, beg: 6, end: 8 }])} stcarts={useState([])} />)
		render(<App/>)
		click('buttonAdd')
		click('buttonEdit1')
		await type('inputName', '1')
		click('inputSlots4')
		click('buttonSave')
		expect(getCartList()).toEqual([['cart1', ['4']]])
	})
})
