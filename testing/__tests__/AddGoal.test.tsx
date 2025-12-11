import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, it, expect, vi} from 'vitest'
import {AddGoal, saveGoalToServer} from '../../src/pages/addGoal'
import {GoalScale, GoalType} from '../../src/data/types'

// https://vitest.dev/guide/browser/component-testing.html
// I reduced the redundent lists by makign the lists for dropdowns for selecting time scale and its lables 
// this makes it cleaner 

describe('AddGoal page', () => {
  it('saves goals to the server', async () => {
    const goal = {
      type: GoalType.Caloric,
      scale: GoalScale.Week,
      amount: 42,
      description: 'Hello world'
    }
    // @ts-ignore
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce((path, request) => {
      expect(path).toEqual('/api/goals')
      expect(request?.method).toEqual('POST')
      expect(request?.headers).toEqual({'Content-Type': 'application/json'})
      expect(request?.body).toEqual(JSON.stringify(goal))
      return Promise.resolve({ok: true, json: () => Promise.resolve()})
    })
    await saveGoalToServer(goal)
  })

  it('switches between goals', async () => {
    render(<AddGoal />)

    // Get the main dropdown
    const mainDropdown = screen.getByLabelText(/Add Goal/i)
    expect(mainDropdown).toBeInTheDocument()

    await userEvent.selectOptions(mainDropdown, GoalType.Caloric)
    expect(screen.getByText('Set Your Calorie Goal')).toBeInTheDocument()

  //  switch and check 
    await userEvent.selectOptions(mainDropdown, GoalType.Fiber)
    expect(screen.getByText('Set Your Fiber Goal')).toBeInTheDocument()


  })

  it('updates CalForm fields correctly', async () => {
    render(<AddGoal />)

    const mainDropdown = screen.getByLabelText(/Add Goal/i)
    await userEvent.selectOptions(mainDropdown, GoalType.Caloric)

   
    const scaleDropdown = screen.getByLabelText(/Time Scale/i)
    expect(scaleDropdown).toHaveValue(GoalScale.Week)

    // Change check
    await userEvent.selectOptions(scaleDropdown, GoalScale.Meal)
    expect(scaleDropdown).toHaveValue(GoalScale.Meal)

    
    expect(screen.getByText(/what amount of calories for meal/i)).toBeInTheDocument()

    // check text entry 
    const caloriesInput = screen.getByLabelText(/What amount of calories/i)
    await userEvent.type(caloriesInput, '200')
    expect(caloriesInput).toHaveValue(200)
  })
})