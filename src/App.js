import React, { useState, useEffect } from 'react'
import {
	Routes,
	Route,
	NavLink,
} from 'react-router-dom'
import { Storage } from '@dwidge/lib-react'

import Slots from './components/Slots'
import Carts from './components/Carts'
import Pubs from './components/Pubs'
import Schedule from './components/Schedule'
import Data from './components/Data'
import './App.css'
const { useStorage } = Storage(useState, useEffect)

const App = () => {
	const stslots = useStorage('carts_slots', [])
	const stcarts = useStorage('carts_carts', [])
	const stpubs = useStorage('carts_pubs', [])

	return (
		<>
			<nav>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/slots'>Slots</NavLink>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/carts'>Carts</NavLink>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/pubs'>Pubs</NavLink>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/schedule'>Schedule</NavLink>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/data'>Data</NavLink>
			</nav>
			<div>
				<Routes>
					<Route path='/' />
					<Route path='/slots' element={<Slots stslots={stslots} />}/>
					<Route path='/carts' element={<Carts stslots={stslots} stcarts={stcarts} />}/>
					<Route path='/pubs' element={<Pubs slots={stslots[0]} carts={stcarts[0]} stpubs={stpubs} />} />
					<Route path='/schedule' element={<Schedule slots={stslots[0]} carts={stcarts[0]} pubs={stpubs[0]} />}/>
					<Route path='/data' element={<Data {...{ stslots, stcarts, stpubs }} />}/>
				</Routes>
			</div>
		</>
	)
}

export default App
