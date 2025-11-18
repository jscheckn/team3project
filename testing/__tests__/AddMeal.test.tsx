import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {AddMeal, saveMealToServer} from '../../src/pages/addMeal'
import CustomWebcam from '../../src/Components/webCam'
import { useState } from 'react'
import '@testing-library/jest-dom/vitest'



// https://vitest.dev/guide/browser/component-testing.html
// we now clean up the file preview with useEffect() to prevent leaks 

// HAVE TO MOCK WEBCAM
vi.mock('../../src/Components/webCam', () => {
  const React = require('react')
  return {
    default: () => {
      const [imgSrc, setImgSrc] = useState<string | null>(null)
      return (
        <div data-testid="webcam-mock">
          <button onClick={() => setImgSrc('mock-image-data')}>Capture photo</button>
          {imgSrc && <img src={imgSrc} alt="Captured" />}
        </div>
      )
    },
  }
})

describe('AddMeal page', () => {
  it('saves meals to the server', async () => {
    const meal = {
      items: [
        {name: 'foo', calories: 100},
        {name: 'bar', protein: 200}
      ],
      notes: 'Hello world'
    }
    // @ts-ignore
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce((path, request) => {
      expect(path).toEqual('/api/meals')
      expect(request?.method).toEqual('POST')
      expect(request?.headers).toEqual({'Content-Type': 'application/json'})
      expect(request?.body).toEqual(JSON.stringify(meal))
      return Promise.resolve({ok: true, json: () => Promise.resolve()})
    })
    await saveMealToServer(meal)
  })

  it('showsi mage after taken', async () => {
    render(<AddMeal />)

    // take pic 
    const takeImageButton = screen.getByText(/Take Image/i)
    await userEvent.click(takeImageButton)

    // get the add photo
    expect(screen.getByTestId('webcam-mock')).toBeInTheDocument() 

    const takePhotoButton = screen.getByText(/Capture photo/i)
    await userEvent.click(takePhotoButton)

    const capturedImg = screen.getByAltText('Captured') as HTMLImageElement
    expect(capturedImg).toBeInTheDocument()
  })

  })

  