import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import AddGoal from '../../src/pages/addGoal'

// https://vitest.dev/guide/browser/component-testing.html
// I reduced the redundent lists by makign the lists for dropdowns for selecting time scale and its lables 
// this makes it cleaner 

describe('AddGoal page', () => {
  it('switches between goals', async () => {
    render(<AddGoal />)

    // Get the main dropdown
    const mainDropdown = screen.getByLabelText(/Add Goal/i)
    expect(mainDropdown).toBeInTheDocument()

    await userEvent.selectOptions(mainDropdown, 'Caloric')
    expect(screen.getByText('Set Your Calorie Goal')).toBeInTheDocument()

  //  switch and check 
    await userEvent.selectOptions(mainDropdown, 'Fiber')
    expect(screen.getByText('Set Your Fiber Goal')).toBeInTheDocument()


  })

  it('updates CalForm fields correctly', async () => {
    render(<AddGoal />)

    const mainDropdown = screen.getByLabelText(/Add Goal/i)
    await userEvent.selectOptions(mainDropdown, 'Caloric')

   
    const scaleDropdown = screen.getByLabelText(/What type of goal are you setting/i)
    expect(scaleDropdown).toHaveValue('week')

    // Change check
    await userEvent.selectOptions(scaleDropdown, 'meal')
    expect(scaleDropdown).toHaveValue('meal')

    
    expect(screen.getByText(/what amount of calories for meal/i)).toBeInTheDocument()

    // check text entry 
    const caloriesInput = screen.getByLabelText(/What amount of calories/i)
    await userEvent.type(caloriesInput, '200')
    expect(caloriesInput).toHaveValue(200)
  })
})