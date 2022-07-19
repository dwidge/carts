import React from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	NavLink,
} from 'react-router-dom'
import { useStorage } from '@dwidge/lib-react/storage'

import Slots from './components/Slots'
import Carts from './components/Carts'
import Pubs from './components/Pubs'
import Schedule from './components/Schedule'
import './App.css'

const App = () => {
	const stslots = useStorage('carts_slots', [])
	const stcarts = useStorage('carts_carts', [])
	const stpubs = useStorage('carts_pubs', [])

	return (
		<Router basename="/carts">
			<nav>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/slots'>Slots</NavLink>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/carts'>Carts</NavLink>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/pubs'>Pubs</NavLink>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/schedule'>Schedule</NavLink>
			</nav>
			<div>
				<Routes>
					<Route path='/slots' element={<Slots stslots={stslots} />}/>
					<Route path='/carts' element={<Carts stslots={stslots} stcarts={stcarts} />}/>
					<Route path='/pubs' element={<Pubs stslots={stslots} stcarts={stcarts} stpubs={stpubs} />} />
					<Route path='/schedule' element={<Schedule stslots={stslots} stcarts={stcarts} stpubs={stpubs} />}/>
				</Routes>
			</div>
		</Router>
	)
}

export default App
